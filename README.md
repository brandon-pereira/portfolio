# Portfolio 

## About
The landing page for [branclon.com](http://www.branclon.com). A place where I can showcase my projects and skills, as well as a place for users to learn about me and how to contact me.

## Installation
#### Dependencies
* [Node](http://nodejs.org)
* [Gulp](http://gulpjs.com/)
* [Brew](http://brew.sh/)

#### Steps
* `brew install imagemagick`
* `brew install graphicsmagick`
* `npm install`
* `bower install`

## Structure
All of the source code is stored in the "/src" folder, this includes css, javascript, and html. The logic for building the development and distribution builds is stored in the root "/" folder. When developing and building a distribution the compiled code is stored in "/dist".

In /src we have the following:
* **/html**: HTML contains HTML files which can be injected into index.html.
* **/index.html**: The skeleton file which is actually compiled. You'll see compile commands in it. Uses gulp-html-extend.
* **/static**: Moved directly to dist folder. Useful for static pages (ex.  404 pages, assets)
* **/projects**: Assets for projects. These will be compressed/resized so they load faster. You can dump your raw assets here and let the build steps do the work.
* **/app.js**: Root JS File. Included first in /dist script file.
* **/js**: Contains subsequent script files. These will be appended to the distribution script file.
	* **/content**: contains content that drives portfolio. Simple JSON objects.
* **/style.less**: The main less file which contains imports and mission critical css.
* **/style**: Contains internal/external less files to be imported.

## Development
As long as everything has been installed correctly you should simply need to run `gulp serve`.

TODO: Generating contact icons (IcoMoon & manifest.json)

## Build
To build a development build you need to do three things.
1. Set isDev to false in gulpfile.js (near beginning of file)
2. Run `gulp clean` to purge /dist folder
3. Run `gulp build --production` to generate /dist folder (without development things like livereload and sourcemaps)