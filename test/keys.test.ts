import * as _projects from '../content/data/projects.json';
import * as _skills from '../content/data/skills.json';

const getAllIdsFromProjects = () => {
  const ids: string[] = [];
  _projects.forEach(project => {
    ids.push(...project.languages.map(lang => lang._id));
  });
  return Array.from(new Set(ids));
};

const getAllIdsFromSkills = () => {
  const ids: string[] = [];
  _skills.forEach(category => {
    category.skills.forEach(skill => {
      if (!('disableProjectsConnection' in skill)) {
        ids.push(skill._id);
      }
    });
  });
  return Array.from(new Set(ids));
};

describe('Valid Keys', () => {
  const projectIds = getAllIdsFromProjects();
  const skillIds = getAllIdsFromSkills();
  test('Project IDs', () => {
    const invalidIds = projectIds.filter(id => !skillIds.includes(id));
    if (invalidIds.length) {
      console.error(
        'Invalid projects detected, search JSON for these keys:',
        invalidIds
      );
    }
    expect(invalidIds).toHaveLength(0);
  });

  test('Skill IDs', () => {
    const invalidIds = skillIds.filter(id => !projectIds.includes(id));
    if (invalidIds.length) {
      console.error(
        'Invalid Skills JSON detected, search JSON for the following keys',
        invalidIds,
        'This is likely because no project currently references these keys.'
      );
    }
    expect(invalidIds).toHaveLength(0);
  });
});
