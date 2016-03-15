var autoprefixer = require('autoprefixer');
// var css = require('./src/css/app.css');

module.exports = {
  entry: __dirname + '/src/js/app.js',
  output: {
    filename: __dirname + '/src/js/app-bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader!postcss-loader",
      }
    ]
  },
  devtool: 'sourcemap',
  postcss: function () {
    return [autoprefixer];
  }
}


// [
//     autoprefixer ({
//       path: ['./src/css']
//     })
    
//     ]