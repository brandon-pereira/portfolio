import { marked } from 'marked';

export default (md: string): Promise<string> =>
  new Promise((resolve, reject) => {
    if (!md) {
      return '';
    }
    marked(md, {}, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
