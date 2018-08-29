require('jest-matcher-one-of');
const projects = require('../content/data/projects.json');
const skills = require('../content/data/skills.json');

describe('Formatting - Projects', () => {
  projects.forEach((el, i) => {
    test(el.title || i, () => {
      expect(typeof el.title).toBe('string'); // Title
      expect(Array.isArray(el.languages)).toBeTruthy(); // Languages
      expect(!isNaN(new Date(el.date))).toBeTruthy(); // Valid Date
      expect(el.description).toBeDefined(); // Description
      expect(el.type).toBeOneOf(['External', 'Internal']); // Type
      expect(Array.isArray(el.images)).toBeTruthy(); // Images if array
      if (el.gitUrl) {
        expect(el.gitUrl.startsWith('http')).toBeTruthy();
      }
      el.images.forEach(img => {
        // Image sanity checks
        expect(typeof img.url).toBe('string');
        expect(typeof img.title).toBe('string');
      });
      expect(el.status).toBeOneOf([
        'Live',
        'Beta',
        'Coming Soon',
        'Unavailable'
      ]); // Check valid status
      // expect(typeof el.link).toBe('string'); // Check valid link
    });
  });
});

describe('Formatting - Skills', () => {
  skills.forEach((category, i) => {
    describe(category.name || i, () => {
      test('Structure', () => {
        expect(typeof category.name).toBe('string');
        expect(Array.isArray(category.skills)).toBeTruthy();
      });
      category.skills.forEach((skill, i) => {
        test(skill.name || i, () => {
          expect(typeof skill._id).toBe('string');
          expect(typeof skill.name).toBe('string');
          expect(typeof skill.description).toBe('string');
          expect(skill.skillLevel).toBeOneOf(['Pro', 'Intermediate', 'Novice']);
        });
      });
    });
  });
});
