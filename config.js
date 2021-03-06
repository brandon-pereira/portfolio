module.exports = {
  production: process.env.NODE_ENV === 'production',
  paths: {
    src: {
      root: './src',
      scripts: './src/scripts/index.js',
      html: './src/html/*.html',
      svg: './src/svgs/*.svg',
      static: ['./src/static/**/*', './content/**/*.{png,jpg,gif,mp4,jpeg,pdf}']
    },
    dist: './dist',
    watch: {
      scripts: [
        './src/scripts/**/*.js',
        './src/styles/**/*.scss',
        './content/**/*.json'
      ],
      html: [
        './src/html/**/*.html',
        './src/styles/critical.css',
        './content/**/*.json'
      ],
      svg: './src/svgs/*.svg',
      static: ['./src/static/**/*', './content/assets/**/*']
    }
  },
  naming: {
    scripts: '[name].bundle.min.js',
    svgs: 'icons.svg'
  }
};
