import { Router } from '../utils/createRouter';
import writeJson from '../utils/writeJson';
import md2html from '../utils/md2html';
import AssetManager, { Asset, RawAsset } from '../utils/assetManager';

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
  await writeJson('apps.json', apps);
  console.timeEnd('Getting apps');
}

const normalizeApps = (
  apps: RawApp[],
  assetManager: AssetManager
): Promise<App[]> => {
  const parsedApps = apps.map(async (app: RawApp): Promise<App> => {
    const parsedApp = {} as App;
    parsedApp._id = app._id || `${Math.random()}`;
    parsedApp.appName = app.appName || '';
    parsedApp.description = await md2html(app.description || '');
    parsedApp.link = app.link;
    parsedApp.icon = assetManager.add(app.icon.fields);
    parsedApp.theme = app.theme || 'default';
    parsedApp.images = app.images.map((img: RawAsset) =>
      assetManager.add(img, {
        jpg: true
      })
    );
    return parsedApp;
  });
  return Promise.all(parsedApps);
};

export default importApps;
