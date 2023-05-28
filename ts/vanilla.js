const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// TODO explore resolve.modules

module.exports = ({
  root,
  mode = 'production',
  bundle = 'main',
  entry = './src/index.ts',
  build = 'build',
  resolve = {},
  externals = {},
  config = {},
  rules = [],
  plugins = [],
  optimization = null
}) => {
  config = {
    extractCSS: true,
    overrideResolve: false,
    overridePlugins: false,
    overrideRules: false,
    terserOptions: {},
    ...config
  };
  resolve = {
    extensions: [],
    ...resolve
  };
  return {
    mode: mode,
    entry: { [bundle]: entry },
    output: {
      path: path.resolve(root, build),
      filename: '[name].[contenthash].js'
    },
    module: {
      rules: config.overrideRules
        ? rules
        : [
          {
            test: /\.tsx?$/,
            use: {
              loader: 'ts-loader'
            }
          },
          {
            test: /\.svg$/,
            use: 'raw-loader'
          },
          {
            test: /\.s?[ac]ss$/,
            exclude: /\.module\.s?[ac]ss$/,
            use: [
              config.extractCSS
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 2 }
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['postcss-preset-env']
                  }
                }
              },
              {
                loader: 'sass-loader',
                options: { implementation: require('sass') }
              }
            ]
          },
          ...rules
        ]
    },
    resolve: config.overrideResolve
      ? resolve
      : {
        ...resolve,
        extensions: ['.ts', '.js', ...resolve.extensions]
      },
    externals: externals,
    plugins: config.overridePlugins
      ? plugins
      : [
        new CleanWebpackPlugin(),
        new Dotenv(),
        new MiniCssExtractPlugin({
          filename: '[name].[contenthash].css'
        }),
        ...plugins
      ],
    optimization: optimization || {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: { properties: true },
            ...config.terserOptions
          }
        }),
        new CssMinimizerWebpackPlugin()
      ],
      splitChunks: { chunks: 'all' }
    }
  };
};
