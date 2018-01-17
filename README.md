# Portfolio 

## About
The landing page for [branclon.com](http://www.branclon.com). A place where I can showcase my projects and skills, as well as a place for users to learn about me and how to contact me.

## Installation
#### Dependencies
* [Node](http://nodejs.org)
* [npm](https://npmjs.org) (bundled with Node)
* Web Browser (see Browser Support for more details)

#### Steps

To run any of the below, you first need to:
```
nvm use
npm install
```

To run locally:
`npm start`

To run a production build:
`npm run build`

To run tests:
`npm test`

## Technical Features
This repo utilizes several features including:
- Webpack (Code Splitting, Tree Shaking, Transpiling, etc.)
- Gulp (Static site generation, minification, critical css rendering, etc.)
- ES6 Code Architecture
- JSON controlled CMS. Add new content to the JSON files and watch the site build itself!
- Jest Unit tests to verify content structure

## Structure
All of the source code is stored in the "/src" folder, this includes css, javascript, and html. The logic for building the development and distribution builds is stored in the root "/" folder. When developing and building a distribution the compiled code is stored in "/dist". "/test" contains all the unit tests.

In /src we have the following:
* **/html**: HTML contains HTML files which can be injected into index.html.
* **/static**: Moved directly to dist folder. Useful for static pages (ex.  404 pages, assets)
* **/scripts**: Contains script files. These will be appended to the distribution script file or referenced asyncronously from Webpack code splitting.
* **/content**: contains content that drives portfolio. Simple JSON objects.
* **/styles/critical.css**: This css file contains above-the-fold css. It is injected directly into the <head> so be careful to keep its size to a minimal.
* **/style/style.scss**: The main sass file which contains below-the-fold css and progressive-enhancements on above the fold css.
* **/style**: Contains internal/external scss files to be imported.

## Browser Support
I said **** fuck it to Internet Explorer on this project. That being said, here's a support list.

* Latest 2 versions of Chrome, Firefox, Safari, and Edge

As well as progressive enhancement on new features. For example Web Animations API will add animations if its supported by the browser.

## Contribute
This repo is used for my portfolio, so contributions aren't needed (although you still can if you want)... however feel free to fork and make your own version... just link back please!