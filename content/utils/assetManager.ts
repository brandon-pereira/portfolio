import http from "http";
import fs from "fs-extra";
import path from "path";
import sharp from "sharp";
import { Asset as ContentfulAsset } from "contentful";

export interface Asset {
  _id: string;
  title: string;
  description?: string;
  url: string;
  contentType: string;
}

interface AssetOptions {
  // Force convert to jpg
  jpg?: boolean;
}

interface InternalAsset extends Asset {
  // raw url to download source from
  actualUrl: string;
}

export type RawAsset = ContentfulAsset["fields"] & {
  _id: string;
};

class AssetManager {
  assets: InternalAsset[];

  static outputFolder = path.resolve(process.cwd(), "src", "assets");

  constructor() {
    this.assets = [];
  }

  add(rawAsset: RawAsset, assetOpts?: AssetOptions): Asset {
    const asset = {} as Asset;
    let extension = rawAsset.file.fileName.split(".").pop();
    if (assetOpts?.jpg || extension === "jpeg") {
      extension = "jpg";
    }
    const actualUrl = rawAsset.file.url;
    const displayUrl = rawAsset._id
      ? `${rawAsset._id}.${extension}`
      : rawAsset.file.fileName;
    asset._id = rawAsset._id;
    asset.title = rawAsset.title;
    asset.description = rawAsset.description;
    asset.url = `/${displayUrl}`;

    asset.contentType = rawAsset.file.contentType;
    console.log(asset.contentType);
    if (assetOpts?.jpg) {
      asset.contentType = "image/jpeg";
    }
    // make sure not already queued
    if (this.assets.find((a) => a.url === asset.url)) {
      return asset;
    }
    this.assets.push({ ...asset, actualUrl });
    return asset;
  }

  async downloadAllAssets(): Promise<void> {
    const promises = this.assets.map((asset) => {
      const sourceUrl = asset.actualUrl;
      const outputPath = path.join(AssetManager.outputFolder, asset.url);
      return this.downloadAsset(sourceUrl, outputPath);
    });
    await Promise.all(promises);
    return;
  }

  async downloadAsset(sourceUrl: string, outputPath: string): Promise<boolean> {
    if (!(await fs.pathExists(outputPath))) {
      await fs.ensureDir(path.dirname(outputPath));
      console.log(
        `File "${path.basename(outputPath)}" doesn't exist. Creating.`
      );
      try {
        await this._downloadFileToDisk(sourceUrl, outputPath);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err && err.code !== "EEXIST") {
          throw err;
        }
      }
    }
    return true;
  }
  _downloadFileToDisk(sourceUrl: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(outputPath, { flags: "wx" });
      const onError = (err: Error | string) => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fs.unlink(outputPath, () => {});
        file.destroy();
        reject(err);
      };
      const request = http.get(
        sourceUrl.replace("//", "http://"),
        (response) => {
          if (!file.destroyed && response.statusCode === 200) {
            const ext = path.extname(outputPath);
            const isImg = [".png", ".jpg"].includes(ext);
            const isJpg = ext === ".jpg";
            if (isImg) {
              let imgCreation = sharp()
                .resize(800, 800, {
                  fit: "inside",
                })
                .jpeg({ quality: 75, force: isJpg })
                .png({ compressionLevel: 9, force: false });
              if (isJpg) {
                imgCreation = imgCreation.flatten({ background: "#fff" });
              }
              response.pipe(imgCreation).pipe(file);
            } else {
              response.pipe(file);
            }
          } else {
            onError(
              `Server responded with ${response.statusCode}: ${response.statusMessage}`
            );
          }
        }
      );

      file.on("error", onError);
      request.on("error", onError);
      file.on("close", () => {
        resolve();
      });
    });
  }
}

export default AssetManager;
