const projects = require('../src/content/projects.json');
const skills = require('../src/content/skills.json');

describe('Formatting - Projects', () => {
    projects.projects.forEach((el, i) => {
        test(el.title || i, () => {
            expect(typeof el.title).toBe('string'); // Title
            expect(Array.isArray(el.languages)).toBeTruthy(); // Languages
            expect(!isNaN(new Date(el.date))).toBeTruthy(); // Valid Date
            expect(el.description).toBeDefined(); // Description
            expect(projects.types[el.type]).toBeDefined(); // Type
            expect(Array.isArray(el.images)).toBeTruthy(); // Images if array
            if(el.gitUrl) {
                expect(el.gitUrl.startsWith('http')).toBeTruthy()
            }
            el.images.forEach((img) => { // Image sanity checks
                expect(typeof img.src).toBe('string');
                expect(typeof img.title).toBe('string');
                expect(typeof img.preview).toBe('string');
            });
            expect(typeof projects.statuses[el.status]).toBe('object'); // Check valid status
            expect(typeof el.link).toBe('string'); // Check valid link
        });
    });
});

describe('Formatting - Skills', () => {
    skills.categories.forEach((category, i) => {
        describe(category.name || i, () => {
            test('Structure', () => {
                expect(typeof category.name).toBe('string');
                expect(Array.isArray(category.skills)).toBeTruthy();
            })
            category.skills.forEach((skill, i) => {
                test(skill.name || i, () => {
                    expect(typeof skill.id).toBe('string');
                    expect(typeof skill.name).toBe('string');
                    expect(typeof skill.description).toBe('string');
                    expect(typeof skill.skillLevel).toBe('number');

                })
            });
        });
    });
});