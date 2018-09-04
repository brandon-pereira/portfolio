import http from 'http';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';

//https://stackoverflow.com/a/45007624/7033335
const downloadFile = async (url, imageNamingFn) => {
  const dest = imageNamingFn(url);
  if (!(await fs.pathExists(dest))) {
    await fs.ensureDir(path.dirname(dest));
    console.log(`File "${path.basename(dest)}" doesn't exist. Creating.`);
    try {
      await _downloadFile(url, dest);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
  }
  return true;
};

const _downloadFile = (url, dest) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest, { flags: 'wx' });
    const onError = err => {
      fs.unlink(dest, () => {});
      file.destroy();
      reject(err);
    };
    const request = http.get(absoluteToHttp(url), response => {
      if (!file.destroyed && response.statusCode === 200) {
        if (['.png', '.jpg', '.jpeg'].includes(path.extname(dest))) {
          const optimize = sharp()
            .resize(800, 800)
            .withoutEnlargement()
            .max()
            // .flatten()
            .jpeg({ quality: 75, force: false })
            .png({ compressionLevel: 9, force: false });
          response.pipe(optimize).pipe(file);
        } else {
          response.pipe(file);
        }
      } else {
        onError(
          `Server responded with ${response.statusCode}: ${
            response.statusMessage
          }`
        );
      }
    });

    file.on('error', onError);
    request.on('error', onError);
    file.on('close', () => {
      resolve();
    });
  });

const imageNamingFn = url =>
  `${path.resolve(
    new URL(import.meta.url).pathname,
    '..',
    '..',
    'assets'
  )}/${url.split('/').pop()}`;

const absoluteToHttp = path => path.replace('//', 'http://');

export { downloadFile, imageNamingFn };
