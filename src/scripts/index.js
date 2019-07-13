const styles = import(/* webpackChunkName: "styles" */ '../styles/style.scss');

import './services/scroll';
import './services/lazyload';

import Header from './components/header';
import Skills from './components/skills';
import Apps from './components/apps';
import Projects from './components/projects';

new Header(document.querySelector('.header'), {});
new Skills(document.querySelector('.skills'), {});
new Apps(document.querySelector('.apps'), {});
new Projects(document.querySelector('.projects'), {});

styles.then(() => {
  // Load real stylesheet then 'eject' the critical css
  document.querySelector('#critical-css').remove();
});

// If its a webkit browser add 'webkit' class to HTML.
if ('webkitTextFillColor' in document.documentElement.style) {
  document.documentElement.classList.add('webkit');
}
