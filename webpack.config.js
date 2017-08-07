const path = require('path');


const sharedConfig = {
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader' },
    ],
  },
  resolve: {
    extensions: [
      '.js', '.jsx', '.json',
    ],
  },
};

const clientConfig = Object.assign({}, sharedConfig, {
  name: 'client',
  entry: './client/index.jsx',
  output: {
    path: path.join(__dirname, '/client-bundle'),
    filename: 'bundle.js',
  },
});

// const serverConfig = Object.assign({}, sharedConfig, {
//   name: 'server',
//   entry: './server/server.js',
//   output: {
//     path: path.join(__dirname, '/server-bundle'),
//     filename: 'bundle.js',
//   },
// });

module.exports = [
  clientConfig, //serverConfig,
];
