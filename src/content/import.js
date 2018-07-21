require('dotenv').config()
const Contentful = require('./contentful');
const writeJson = require('write-json');
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
    let skills = await client.getEntries('projects', {});
    skills = normalizeSkills(skills);
    await writeJson(__dirname + '/_projects.json', skills).promise;
    console.timeEnd("Getting projects");
}

const normalizeSkills = (categories) =>
    categories.map(category => {
        if(!category.skills || !Array.isArray(category.skills)) {
            category.skills = [];
        }
        // category.skills = category.skills.map(skill => skill.fields);
        return category;
    });

app();
