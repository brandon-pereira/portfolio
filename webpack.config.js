const config = require('./config');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const getPlugins = () => {
  const plugins = [
    new webpack.optimize.LimitChunkCountPlugin({
      minChunkSize: 10000,
      maxChunks: 5
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(process.env.NODE_ENV === 'production')
    })
  ];

  if (!config.production) {
    plugins.push(
      ...[
        new webpack.SourceMapDevToolPlugin(),
        new webpack.HotModuleReplacementPlugin()
        // new BundleAnalyzerPlugin()
      ]
    );
  }

  return plugins;
};

module.exports = {
  mode: config.isProduction ? 'production' : 'development',
  devtool: config.isProduction ? false : 'eval-source-map',
  entry: config.paths.src.scripts,
  output: {
    publicPath: 'scripts/',
    filename: config.naming.scripts
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: {
                      browsers: ['last 2 versions']
                    }
                  }
                ]
              ],
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
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: getPlugins()
};
