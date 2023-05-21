const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const HtmlWebpackPage = ({ page, package, template, bookmarkletTitle }) =>
  new HtmlWebpackPlugin({
    templateParameters: {
      REPO_OWNER: package.repository.url.replace(
        /\/github.com\/([^/]+)\/.*/,
        '$1'
      ),
      REPO_NAME: package.repository.url.replace(
        /\/github.com\/[^/]+\/([^/]+)\/.*/,
        '$1'
      ),
      BOOKMARKLET_TITLE: bookmarkletTitle
    },
    template: path.resolve(template, page),
    hash: true
  });

module.exports = ({
  root,
  bookmarkletTitle,
  package,
  entry = './src/index.ts',
  build = 'build',
  externals = {},
  terserOptions = undefined
}) => {
  const template = path.resolve(
    root,
    'node_modules',
    '@battis/webpack',
    'template',
    'bookmarklet'
  );
  console.log(template);
  return {
    mode: 'production',
    entry: { main: entry },
    output: {
      path: path.resolve(root, build),
      filename: 'bookmarklet.js'
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
        },
        {
          test: /\.(jpe?g|gif|png)/,
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash].[ext]',
            outputPath: 'assets/images'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    externals: externals,
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv(),
      new HtmlWebpackPage({
        page: 'index.html',
        package,
        bookmarkletTitle,
        template
      }),
      new HtmlWebpackPage({
        page: 'embed.html',
        package,
        bookmarkletTitle,
        template
      }),
      new MiniCssExtractPlugin({
        filename: 'stylesheet.css'
      })
    ],
    optimization: {
      minimize: true,
      minimizer: [
        '...',
        new TerserPlugin(terserOptions),
        new CssMinimizerWebpackPlugin()
      ],
      splitChunks: { chunks: 'all' }
    }
  };
};
