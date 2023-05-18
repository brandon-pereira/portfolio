import 'dotenv/config';

import createRouter from './utils/createRouter';

import importAboutYou from './models/aboutYou';
import importProjects from './models/projects';
import importSkills from './models/skills';
import importApps from './models/apps';

(async () => {
  console.time('Initializing');
  const router = createRouter();
  console.timeEnd('Initializing');
  console.time('Importing content');
  await Promise.all([
    importSkills(router),
    importProjects(router),
    importAboutYou(router),
    importApps(router)
  ]);
  console.timeEnd('Importing content');
  console.time('Importing Assets');
  await router.assetManager.downloadAllAssets();
  console.timeEnd('Importing Assets');
})();
