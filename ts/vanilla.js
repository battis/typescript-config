const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// TODO explore resolve.modules

module.exports = ({
  root,
  bundle = 'main',
  entry = './src/index.ts',
  template = 'public',
  build = 'build',
  publicPath = '/',
  externals = {},
  production = true,
  terserOptions = undefined
}) => {
  const config = {
    mode: 'production',
    entry: { [bundle]: entry },
    output: {
      path: path.resolve(root, build),
      filename: '[name].[contenthash].js',
      publicPath: publicPath
    },
    module: {
      rules: [
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
          use: [
            MiniCssExtractPlugin.loader,
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
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js']
    },
    externals: externals,
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin()
        //        new CssMinimizerWebpackPlugin()
      ],
      splitChunks: { chunks: 'all' }
    }
  };
  if (!production) {
    config.mode = 'development';
    config.devtool = 'inline-source-map';
    config.module.rules = config.module.rules.map((rule) => {
      if (rule.test == /\.s?[ac]ss$/) {
        rule.use = rule.use.map((loader) => {
          if (loader == MiniCssExtractPlugin.loader) {
            loader = 'style-loader';
          }
          return loader;
        });
      }
      return rule;
    });
    config.devServer = {
      open: true,
      hot: true,
      watchFiles: [path.join(root, template, '**/*')]
    };
  }
  return config;
};
