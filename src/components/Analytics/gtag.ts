const isDev = import.meta.env.DEV;

if (!isDev) {
  window.dataLayer = window.dataLayer || [];
  function gtag(..._args: any[]) {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-KPH6GZV558');
}
