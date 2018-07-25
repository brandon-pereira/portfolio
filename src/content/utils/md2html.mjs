import marked from 'marked';

export default (md) =>
    new Promise((resolve, reject) => {
        marked(md, {}, (err, html) => {
            err ? reject(err) : resolve(html)
        });
    })