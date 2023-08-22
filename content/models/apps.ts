import { Router } from "../utils/createRouter";
import writeJson from "../utils/writeJson";
import md2html from "../utils/md2html";
import AssetManager, { Asset, RawAsset } from "../utils/assetManager";
import slugify from "slugify";
import generateMarkdown from "../utils/generateMarkdown";
import { writeFile } from "fs-extra";

type App = {
  _id: string;
  appName: string;
  description: string;
  link?: string;
  icon: Asset;
  theme: string;
  images: Asset[];
};

// Defines expected response from service
interface RawApp extends Omit<Partial<App>, "images" | "icon"> {
  images: RawAsset[];
  icon: {
    _id: string;
    fields: RawAsset;
  };
}

async function importApps({ contentful, assetManager }: Router): Promise<void> {
  console.time("Getting apps");
  const rawData = (await contentful.getEntries("apps", {
    order: "fields.position",
  })) as RawApp[];
  const apps = await normalizeApps(rawData, assetManager);
  await Promise.all(
    apps.map(async (app) => {
      return writeFile(
        `./src/content/apps/${slugify(app.appName, {
          lower: true,
          remove: /[*+~.()'"!/:@]/g,
        })}.md`,
        generateMarkdown(
          {
            // ...project,
            // // prettier-ignore
            // title: project.title.replace(":", "\:"),
            // description: project.shortDescription,
            // shortDescription: null,
            // languages: project.languages.map((lang) => lang.name).join(", "),
            // primaryImage:
            //   project.images?.[0]?.url &&
            //   `../../assets/${project.thumbnail?.url}`,
            ...app,
            description: undefined,
          },
          app.description
        )
      );
    })
  );
  console.timeEnd("Getting apps");
}

const normalizeApps = (
  apps: RawApp[],
  assetManager: AssetManager
): Promise<App[]> => {
  const parsedApps = apps.map(async (app: RawApp): Promise<App> => {
    const parsedApp = {} as App;
    parsedApp._id = app._id || `${Math.random()}`;
    parsedApp.appName = app.appName || "";
    parsedApp.description = app.description || "";
    parsedApp.link = app.link;
    parsedApp.icon = `../../assets/${assetManager.add(app.icon.fields).url}`;
    parsedApp.theme = app.theme || "default";
    parsedApp.images = app.images.map((img: RawAsset) => assetManager.add(img));
    return parsedApp;
  });
  return Promise.all(parsedApps);
};

export default importApps;
