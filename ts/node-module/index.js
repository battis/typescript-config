const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = ({
  root,
  bundle = 'lib',
  entry = './src/index.ts',
  libraryName,
  production = true
}) => ({
  mode: production ? 'production' : 'development',
  target: 'node',
  entry: {
    [bundle]: entry,
    [`${bundle}.min`]: entry
  },
  output: {
    path: path.resolve(root, '_bundles'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: libraryName,
    umdNamedDefine: true
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devtool: 'source-map',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/
      })
    ],
    splitChunks: { chunks: 'all' }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  }
});
