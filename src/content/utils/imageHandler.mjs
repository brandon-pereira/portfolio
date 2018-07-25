import http from 'http';
import fs from 'fs';
import path from 'path';

//https://stackoverflow.com/a/45007624/7033335
const downloadImage = (url, imageNamingFn) =>
    new Promise((resolve, reject) => {
        const dest = imageNamingFn(url);
        const file = fs.createWriteStream(dest, { flags: "wx" });
        const request = http.get(absoluteToHttp(url), response => {
            if (response.statusCode === 200) {
                response.pipe(file);
            } else {
                file.close();
                fs.unlink(dest, () => {}); // Delete temp file
                reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
            }
        });

        request.on("error", err => {
            console.log(err);
            file.close();
            fs.unlink(dest, () => {}); // Delete temp file
            reject(err.message);
        });

        file.on("finish", () => {
            resolve();
        });

        file.on("error", err => {
            console.log(err.code);
            file.close();
            if (err.code === "EEXIST") {
                reject("File already exists");
            } else {
                // fs.unlink(dest, () => {}); // Delete temp file
                reject(err.message);
            }
        });
    });

const imageNamingFn = (url) =>
    `${path.resolve(new URL(import.meta.url).pathname, '..', '..', 'assets')}/${url.split('/').pop()}`

const absoluteToHttp = (path) => path.replace('//', 'http://');


export {
    downloadImage,
    imageNamingFn
}