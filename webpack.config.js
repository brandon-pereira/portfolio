const config = require('./config');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin;

const getPlugins = () => {
  const plugins = [
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')
    })
    // new BundleAnalyzerPlugin()
  ];

  if (!config.production) {
    plugins.push(
      ...[
        new webpack.SourceMapDevToolPlugin(),
        new webpack.HotModuleReplacementPlugin()
      ]
    );
  }

  return plugins;
};

module.exports = {
  mode: config.production ? 'production' : 'development',
  devtool: config.production ? false : 'eval-source-map',
  entry: config.paths.src.scripts,
  output: {
    publicPath: 'scripts/',
    filename: config.naming.scripts
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        // exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [
                'add-module-exports', // export default will allow you to import without typing .default
                '@babel/plugin-syntax-dynamic-import'
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1, url: false } },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')(),
                require('cssnano')()
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  plugins: getPlugins()
};
