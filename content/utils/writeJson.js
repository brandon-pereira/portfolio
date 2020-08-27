import fs from 'fs';
const { writeFile } = fs.promises;

import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default (fileName, json) =>
  writeFile(
    path.join(__dirname, '..', 'data', fileName),
    JSON.stringify(json, null, '  ')
  ).promise;
