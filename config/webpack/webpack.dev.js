// merger didnt have {} originally
const { merge } = require('webpack-merge');
const path = require('path');

const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../..', 'dist'),
  },
  devtool: 'inline-source-map',
});
