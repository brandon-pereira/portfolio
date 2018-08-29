import dotenv from 'dotenv';
import writeJson from './utils/writeJson';
import Contentful from './utils/contentful';
import { downloadFile, imageNamingFn } from './utils/downloadFile';
import md2html from './utils/md2html';

dotenv.config();
const client = new Contentful({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});
const images = [];

const importSkills = async () => {
  console.time('Getting skills');
  let skills = await client.getEntries('skills', {
    'fields.isCategory': true,
    order: 'sys.createdAt'
  });
  skills = normalizeSkills(skills);
  await writeJson('skills.json', skills);
  console.timeEnd('Getting skills');
};

const importApps = async () => {
  console.time('Getting apps');
  let apps = await client.getEntries('apps', {
    order: 'sys.createdAt'
  });
  apps = await normalizeApps(apps);
  await writeJson('apps.json', apps);
  console.timeEnd('Getting apps');
};

const importProjects = async () => {
  console.time('Getting projects');
  let projects = await client.getEntries('projects', {
    order: '-fields.date'
  });
  projects = await normalizeProjects(projects);
  await writeJson('projects.json', projects);
  console.timeEnd('Getting projects');
};

const importAboutYou = async () => {
  console.time('Getting information about you');
  let aboutYou = await client.getEntries('about', {});
  aboutYou = await normalizeAboutYou(aboutYou[0]);
  await writeJson('about.json', aboutYou);
  console.timeEnd('Getting information about you');
};

const importAllAssets = () =>
  Promise.all(
    [...new Set(images)].map(src => downloadFile(src, imageNamingFn))
  );
const normalizeAboutYou = async aboutYou => {
  aboutYou.description = await md2html(aboutYou.description);
  aboutYou.resume = normalizeAsset(aboutYou.resume.fields);
  return aboutYou;
};

const normalizeAsset = asset => {
  const output = {};
  output._id = asset._id;
  output.title = asset.title;
  output.description = asset.description;
  images.push(asset.file.url);
  output.url = `/assets/${asset.file.fileName}`;
  output.contentType = asset.file.contentType;
  return output;
};

const normalizeApps = apps =>
  Promise.all(
    apps.map(async app => {
      app.description = await md2html(app.description);
      app.icon = normalizeAsset(app.icon.fields);
      app.images = app.images.map(img => normalizeAsset(img));
      return app;
    })
  );

const normalizeSkills = categories =>
  categories
    .map(category => {
      if (!category.skills || !Array.isArray(category.skills)) {
        category.skills = [];
      }
      return category;
    })
    .sort((a, b) => b.skills.length - a.skills.length);

const normalizeProjects = projects =>
  Promise.all(
    projects.map(async project => {
      project.images = project.images
        ? project.images.map(img => normalizeAsset(img))
        : [];
      project.description =
        project.description && (await md2html(project.description));
      return project;
    })
  );

(async () => {
  console.time('Importing content');
  await Promise.all([
    importSkills(),
    importProjects(),
    importAboutYou(),
    importApps()
  ]);
  console.timeEnd('Importing content');
  console.time('Importing Assets');
  importAllAssets();
  console.timeEnd('Importing Assets');
})();
