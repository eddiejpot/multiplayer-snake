const path = require('path');

module.exports = {
  entry: './src/snake/sketch.js',
  // entry: '../../src/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
