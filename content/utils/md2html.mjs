import marked from 'marked';

//https://github.com/markedjs/marked/issues/655#issuecomment-383226346
// const renderer = new marked.Renderer();
// const linkRenderer = renderer.link;
// renderer.link = (href, title, text) => {
//   const html = linkRenderer.call(renderer, href, title, text);
//   return html.replace(/^<a /, '<a target="_blank" ');
// };

export default md =>
  new Promise((resolve, reject) => {
    if (!md) {
      return '';
    }
    marked(md, {}, (err, html) => {
      err ? reject(err) : resolve(html);
    });
  });
