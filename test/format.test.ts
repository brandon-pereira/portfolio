import * as projects from '../content/data/projects.json';
import * as skills from '../content/data/skills.json';

describe('Formatting - Projects', () => {
  (projects || []).forEach((project, i) => {
    test(project.title || `Project Element #${i + 1}`, () => {
      expect(typeof project.title).toBe('string'); // Title
      expect(Array.isArray(project.languages)).toBeTruthy(); // Languages\
      const date = new Date(project.date);
      expect(date instanceof Date && !isNaN(date.valueOf())).toBeTruthy(); // Valid Date
      expect(project.description).toBeDefined(); // Description
      expect(['External', 'Internal'].includes(project.type)).toBeTruthy(); // Type
      expect(Array.isArray(project.images)).toBeTruthy(); // Images if array
      if (project.gitUrl) {
        expect(project.gitUrl.startsWith('http')).toBeTruthy();
      }
      project.images.forEach(img => {
        // Image sanity checks
        expect(typeof img.url).toBe('string');
        expect(typeof img.title).toBe('string');
      });
      expect(
        ['Live', 'Beta', 'Coming Soon', 'Unavailable'].includes(project.status)
      ).toBeTruthy(); // Check valid status
    });
  });
});

describe('Formatting - Skills', () => {
  (skills || []).forEach((category, i) => {
    describe(category.name || i, () => {
      test('Structure', () => {
        expect(typeof category.name).toBe('string');
        expect(Array.isArray(category.skills)).toBeTruthy();
      });
      category.skills.forEach((skill, i) => {
        test(skill.name || `Skill #${i}`, () => {
          expect(typeof skill._id).toBe('string');
          expect(typeof skill.name).toBe('string');
          expect(typeof skill.description).toBe('string');
        });
      });
    });
  });
});
