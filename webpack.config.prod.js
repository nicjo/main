var autoprefixer = require ("autoprefixer");
var webpack = require("webpack");
<<<<<<< HEAD
=======

>>>>>>> common/master
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
        loader: "style-loader!css-loader!postcss-loader", //order critical (last to first)
      },
      {
        test:/\.(jpg|png|gif)$/i,  //regular expression (matches parts of a string 'i' = case-insensitive)
        loader:'url'
      }
    ]
  },
  devtool: 'sourcemap',
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ],
  plugins: [new webpack.optimize.UglifyJsPlugin()]
}


<<<<<<< HEAD
=======
// [
//     autoprefixer ({
//       path: ['./src/css']
//     })
    
//     ]

>>>>>>> common/master
