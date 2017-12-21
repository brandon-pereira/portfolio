import('../styles/style.scss');
import('./app').then((App) => new App());
import('./components/webfontloader').then(webfontloader => webfontloader());