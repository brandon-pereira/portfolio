const _projects = require('../content/data/projects.json');
const _skills = require('../content/data/skills.json');

const getAllIdsFromProjects = _projects => {
  const ids = [];
  _projects.forEach(project => {
    ids.push(...project.languages.map(lang => lang._id));
  });
  return Array.from(new Set(ids));
};

const getAllIdsFromSkills = _skills => {
  const ids = [];
  _skills.forEach(category => {
    category.skills.forEach(skill => {
      ids.push(skill._id);
    });
  });
  return Array.from(new Set(ids));
};

describe('Valid Keys', () => {
  const projectIds = getAllIdsFromProjects(_projects);
  const skillIds = getAllIdsFromSkills(_skills);
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