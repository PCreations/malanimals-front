var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
        MALANIMALS_API: "'http://localhost:8000/animals/'",
        'process.env': {
            'NODE_ENV': JSON.stringify('development'),
            'BABEL_ENV': JSON.stringify('development')
        },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      },
      { test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  }
}
