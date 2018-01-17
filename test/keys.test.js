const projects = require('../src/content/projects.json');
const skills = require('../src/content/skills.json');

const getAllIdsFromProjects = (projects) => {
    const ids = [];
    projects.projects.forEach(project => {
        ids.push(...project.languages);
    });
    return Array.from(new Set(ids));
}

const getAllIdsFromSkills = (skills) => {
    const ids = [];
    skills.categories.forEach(category => {
        category.skills.forEach(skill => {
            ids.push(skill.id);
        })
    });
    return Array.from(new Set(ids));
}

describe('Valid Keys', () => {
    const projectIds = getAllIdsFromProjects(projects);
    const skillIds = getAllIdsFromSkills(skills);
    test('Project IDs', () => {
        const invalidIds = projectIds.filter((id) => !skillIds.includes(id));
        if (invalidIds.length) {
            console.error(invalidIds);
        }
        expect(invalidIds.length).toBe(0);
    });

    test('Skill IDs', () => {
        const invalidIds = skillIds.filter((id) => !projectIds.includes(id));
        if (invalidIds.length) {
            console.error(invalidIds);
        }
        expect(invalidIds.length).toBe(0);
    });
});
