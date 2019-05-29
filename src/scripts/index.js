const styles = import('../styles/style.scss');
import('./services/scroll');
import('./services/lazyload');

// Async load all components
const components = [
  [import('./components/header'), document.querySelector('.header'), {}],
  [import('./components/skills'), document.querySelector('.skills'), {}],
  [import('./components/apps'), document.querySelector('.apps'), {}],
  [import('./components/projects'), document.querySelector('.projects'), {}]
];
components.forEach(component => {
  // Components export a class, so we instantiate
  component[0].then(
    Class => new Class.default(component[1], component[2] || {})
  );
});

Promise.all([styles, ...components.map(c => c[0])]).then(() => {
  // Load real stylesheet then 'eject' the critical css
  document.querySelector('#critical-css').remove();
});

// If its a webkit browser add 'webkit' class to HTML.
if ('webkitTextFillColor' in document.documentElement.style) {
  document.documentElement.classList.add('webkit');
}
