const importFresh = require('import-fresh');

module.exports = {
  locals: {
    seo: importFresh('./content/data/seo.json'),
    projects: importFresh('./content/data/projects.json'),
    apps: importFresh('./content/data/apps.json'),
    skills: importFresh('./content/data/skills.json'),
    contact: importFresh('./content/data/contact.json'),
    about: importFresh('./content/data/about.json')
  }
};