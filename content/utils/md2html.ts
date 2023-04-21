import { marked } from 'marked';

export default (md: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!md) {
      return '';
    }
    const renderer = new marked.Renderer();
    renderer.link = function (href, title, text) {
      return `<a target="_blank" href="${href}">${text}` + '</a>';
    };
    marked(md, { renderer }, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
