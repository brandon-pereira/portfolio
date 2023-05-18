import fs from 'fs';
const { writeFile } = fs.promises;

import path from 'path';

export default (fileName: string, json: unknown): Promise<void> =>
  writeFile(
    path.join(__dirname, '..', 'data', fileName),
    JSON.stringify(json, null, '  ')
  );
