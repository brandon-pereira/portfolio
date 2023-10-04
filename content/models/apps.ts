import { Router } from '../utils/createRouter';
import writeJson from '../utils/writeJson';
import md2html from '../utils/md2html';
import AssetManager, { Asset, RawAsset } from '../utils/assetManager';
import slugify from 'slugify';
import generateMarkdown from '../utils/generateMarkdown';
import { writeFile } from 'fs-extra';

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
interface RawApp extends Omit<Partial<App>, 'images' | 'icon'> {
  images: RawAsset[];
  icon: {
    _id: string;
    fields: RawAsset;
  };
}

async function importApps({ contentful, assetManager }: Router): Promise<void> {
  console.time('Getting apps');
  const rawData = (await contentful.getEntries('apps', {
    order: 'fields.position'
  })) as RawApp[];
  const apps = await normalizeApps(rawData, assetManager);
  await Promise.all(
    apps.map(async app => {
      return writeFile(
        `./src/content/apps/${app.id}.md`,
        generateMarkdown(
          {
            ...app,
            images: app.images.map(img => ({
              ...img,
              url: `../../assets${img.url}`
            })),
            description: undefined
          },
          app.description
        )
      );
    })
  );
  console.timeEnd('Getting apps');
}

const normalizeApps = (
  apps: RawApp[],
  assetManager: AssetManager
): Promise<App[]> => {
  const parsedApps = apps.map(async (app: RawApp): Promise<App> => {
    const parsedApp = {} as App;
    parsedApp.id = slugify(app.appName!, {
      lower: true,
      remove: /[*+~.()'"!/:@]/g
    });
    parsedApp.appName = app.appName || '';
    parsedApp.description = app.description || '';
    parsedApp.link = app.link;
    parsedApp.icon = `../../assets${
      assetManager.add(app.icon.fields, {
        url: `apps/${parsedApp.id}/icon`
      }).url
    }`;
    parsedApp.theme = app.theme || 'default';
    parsedApp.images = app.images.map((img: RawAsset, i) =>
      assetManager.add(img, { url: `apps/${parsedApp.id}/${i}` })
    );
    return parsedApp;
  });
  return Promise.all(parsedApps);
};

export default importApps;
