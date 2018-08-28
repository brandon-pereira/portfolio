import dotenv from 'dotenv';
import writeJson from './utils/writeJson';
import Contentful from './utils/contentful';
import { downloadImage, imageNamingFn } from './utils/imageHandler';
import md2html from './utils/md2html';
dotenv.config();

const client = new Contentful({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

const importSkills = async () => {
  console.time('Getting skills');
  let skills = await client.getEntries('skills', { 'fields.isCategory': true });
  skills = normalizeSkills(skills);
  await writeJson('test.json', skills);
  console.timeEnd('Getting skills');
};

const importProjects = async () => {
  console.time('Getting projects');
  const _projects = await client.getEntries('projects', {});
  const { projects, images } = await normalizeProjects(_projects);
  await writeJson('_projects.json', projects);
  console.timeEnd('Getting projects');
  console.time('Getting project assets');
  await importAllAssets(images);
  console.timeEnd('Getting project assets');
};

const importAboutYou = async () => {
  console.time('Getting information about you');
  let aboutYou = await client.getEntries('about', {});
  aboutYou = await normalizeAboutYou(aboutYou[0]);
  await writeJson('_about.json', aboutYou);
  console.timeEnd('Getting information about you');
  if (aboutYou.resume) {
    console.time('Getting your resume');
    await downloadImage(aboutYou.resume);
    console.timeEnd('Getting your resume');
  }
};

const importAllAssets = (images = []) =>
  Promise.all(
    images.map(src =>
      downloadImage(src, imageNamingFn).catch(err => {
        console.error(err);
      })
    )
  );

const normalizeAboutYou = async aboutYou => {
  aboutYou.description = await md2html(aboutYou.description);
  return aboutYou;
};

const normalizeSkills = categories =>
  categories
    .map(category => {
      if (!category.skills || !Array.isArray(category.skills)) {
        category.skills = [];
      }
      return category;
    })
    .sort((a, b) => b.skills.length - a.skills.length);

const normalizeProjects = async projects => {
  const images = [];
  projects = await Promise.all(
    projects.map(async project => {
      project.images =
        project.images &&
        project.images.map(img => {
          images.push(img.file.url);
          img.url = img.file.fileName;
          img.contentType = img.file.contentType;
          delete img.file;
          return img;
        });
      project.description =
        project.description && (await md2html(project.description));
      return project;
    })
  );
  projects = projects.sort((a, b) => new Date(b.date) - new Date(a.date));
  return {
    projects,
    images
  };
};

(async () => {
  console.time('Importing content');
  await Promise.all([
    // importSkills(),
    importProjects()
    // importAboutYou()
  ]);
  console.timeEnd('Importing content');
})();
