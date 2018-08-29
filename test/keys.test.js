const projects = require('../content/data/projects.json');
const skills = require('../content/data/skills.json');

const getAllIdsFromProjects = projects => {
  const ids = [];
  projects.forEach(project => {
    ids.push(...project.languages.map(lang => lang._id));
  });
  return Array.from(new Set(ids));
};

const getAllIdsFromSkills = skills => {
  const ids = [];
  skills.forEach(category => {
    category.skills.forEach(skill => {
      ids.push(skill._id);
    });
  });
  return Array.from(new Set(ids));
};

describe('Valid Keys', () => {
  const projectIds = getAllIdsFromProjects(projects);
  const skillIds = getAllIdsFromSkills(skills);
  test('Project IDs', () => {
    const invalidIds = projectIds.filter(id => !skillIds.includes(id));
    if (invalidIds.length) {
      console.error(invalidIds);
    }
    expect(invalidIds.length).toBe(0);
  });

  test('Skill IDs', () => {
    const invalidIds = skillIds.filter(id => !projectIds.includes(id));
    if (invalidIds.length) {
      console.error(invalidIds);
    }
    expect(invalidIds.length).toBe(0);
  });
});
