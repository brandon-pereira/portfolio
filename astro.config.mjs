import { defineConfig } from 'astro/config';
import serviceWorker from 'astrojs-service-worker';
import rehypeExternalLinks from 'rehype-external-links';

export default defineConfig({
  site: 'https://branclon.com',
  integrations: [serviceWorker()],
  markdown: {
    // forces external links to open in a new tab
    rehypePlugins: [[rehypeExternalLinks, { target: '_blank' }]]
  }
});
