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

const app = async () => {
    console.time('Importing content');
    await Promise.all([importSkills(), importProjects()]);
    console.timeEnd('Importing content');
}

const importSkills = async () => {
    console.time("Getting skills");
    let skills = await client.getEntries('skills', {'fields.isCategory': true});
    skills = normalizeSkills(skills);
    await writeJson('test.json', skills).promise;
    console.timeEnd("Getting skills");
}

const importProjects = async () => {
    console.time("Getting projects");
    const _projects = await client.getEntries('projects', {});
    const { projects, images } = await normalizeProjects(_projects);
    await writeJson('_projects.json', projects).promise;
    console.timeEnd("Getting projects");
    console.time("Getting project assets");
    console.log(images);
    await importAllAssets(images);
    console.timeEnd("Getting project assets");
}

const importAllAssets = (images = []) =>
    Promise.all(images.map(src =>
        downloadImage(src, imageNamingFn)
            // .then((e) => console.log("HERE",e))
            .catch(err => {
                console.error(err);
            })
    ))
        // downloadImage(projects[0].images[0].file.url, imageNamingFn)


const normalizeSkills = (categories) =>
    categories.map(category => {
        if(!category.skills || !Array.isArray(category.skills)) {
            category.skills = [];
        }
        return category;
    }).sort((a, b) => b.skills.length - a.skills.length);

const normalizeProjects = async projects => {
    const images = [];
    projects = await Promise.all(projects.map(async project => {
        project.images = project.images && project.images.map(img => {
            images.push(img.file.url);
            img.url = img.file.fileName;
            img.contentType = img.file.contentType;
            delete img.file;
            return img;
        })
        project.description = project.description && await md2html(project.description);
        return project;
    }))
    projects = projects.sort((a, b) => new Date(b.date) - new Date(a.date));
    return {
        projects,
        images
    }
}

app();
