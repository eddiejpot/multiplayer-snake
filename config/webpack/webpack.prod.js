// merger didnt have {} originally
const { merge } = require('webpack-merge');
const path = require('path');

const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, '../..', 'dist'),
  },
});
