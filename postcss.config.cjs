module.exports = {
  plugins: [
    require('@csstools/postcss-global-data')({
      files: ['./src/css/customMedia.css']
    }),
    require('postcss-custom-media'),
    require('postcss-nesting')
  ]
};
