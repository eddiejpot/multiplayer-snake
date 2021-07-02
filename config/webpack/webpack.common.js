const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home.js',
    singleplayer: './src/pages/singleplayerSnake.js',
    multiplayer: './src/pages/multiplayerSnake.js',
  },

  output: {
    // the [name] property will reference entry. in our case it's home,singleplayer,multiplayer
    // filename: '[name]-[contenthash].bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../..', 'dist'),
  },

  plugins: [
    new MiniCssExtractPlugin(),
    // info on the html plugin
    // https://github.com/jantimon/html-webpack-plugin/issues/218
    new HtmlWebpackPlugin({
      inject: true,
      filename: './home.html',
      chunks: ['home'],
      template: path.resolve(__dirname, '../../src/pages', 'home.html'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: './singleplayer.html',
      chunks: ['singleplayer'],
      template: path.resolve(__dirname, '../../src/pages', 'singleplayer.html'),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: './multiplayer.html',
      chunks: ['multiplayer'],
      template: path.resolve(__dirname, '../../src/pages', 'multiplayer.html'),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(js|mjs|jsx)$/, // regex to see which files to run babel on
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env',
              {
                plugins: ['@babel/plugin-transform-runtime'],
              },
            ],
          },
        },
      },
    ],
  },

};
