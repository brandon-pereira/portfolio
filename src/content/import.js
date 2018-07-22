require('dotenv').config()
const Contentful = require('./contentful');
const writeJson = require('write-json');
const marked = require('marked');

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
    await writeJson(__dirname + '/test.json', skills).promise;
    console.timeEnd("Getting skills");
}

const importProjects = async () => {
    console.time("Getting projects");
    let projects = await client.getEntries('projects', {});
    projects = await normalizeProjects(projects);
    await writeJson(__dirname + '/_projects.json', projects).promise;
    console.timeEnd("Getting projects");
}

const normalizeSkills = (categories) =>
    categories.map(category => {
        if(!category.skills || !Array.isArray(category.skills)) {
            category.skills = [];
        }
        return category;
    }).sort((a, b) => b.skills.length - a.skills.length);

const normalizeProjects = async projects => {
    projects = await Promise.all(projects.map(async project => {
        project.description = project.description && await md2html(project.description);
        return project;
    }))
    return projects.sort((a, b) => new Date(b.date) - new Date(a.date));
}

const md2html = (md) =>
    new Promise((resolve, reject) => {
        marked(md, {}, (err, html) => {
            err ? reject(err) : resolve(html)
        });
    })

app();
