const webpack = require('webpack');
const pkg = require('./package.json');
const createOutput = require('./createConfig');

const banner = `${pkg.name}
${pkg.description}\n
@version v${pkg.version}
@author ${pkg.author}
@homepage ${pkg.homepage}
@repository ${pkg.repository.url}`;

const plugins = [
  new webpack.BannerPlugin(banner)
];
module.exports = env => ({
  entry: `${__dirname}/index.js`,
  devtool: 'source-map',
  mode: 'development',
  output: createOutput(env.target, env.mode),
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  plugins: plugins
});
