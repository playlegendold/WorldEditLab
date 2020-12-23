const path = require('path');

module.exports = {
  entry: './assets/scripts/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public/scripts/')
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  }
};
