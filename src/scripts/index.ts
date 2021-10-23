import './services/scroll';
import './services/lazyload';

import Header from './components/header';
// import Skills from './components/skills';
// import Apps from './components/apps';
// import Projects from './components/projects';

new Header(document.querySelector('.header'));
// new Skills(document.querySelector('.skills'));
// new Apps(document.querySelector('.apps'));
// new Projects(document.querySelector('.projects'));

// If its a webkit browser add 'webkit' class to HTML.
if ('webkitTextFillColor' in document.documentElement.style) {
  document.documentElement.classList.add('webkit');
}
