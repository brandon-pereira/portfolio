const importFresh = require('import-fresh');

console.log('HELLO!');
module.exports = {
  root: '.',
  data() {
    return {
      projects: importFresh('./content/data/projects.json'),
      apps: importFresh('./content/data/apps.json'),
      skills: importFresh('./content/data/skills.json'),
      contact: importFresh('./content/data/contact.json'),
      about: importFresh('./content/data/about.json')
    };
  },
  assetType({ baseExt, dirname }) {
    console.log(baseExt, dirname);
    return baseExt || dirname;
  }
};
