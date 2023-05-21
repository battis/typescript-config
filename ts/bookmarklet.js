const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CreateFilePlugin = require('create-file-webpack');

module.exports = ({ root, package, title, externals = {} }) => {
  const HtmlWebpackPage = (page) =>
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
        TITLE: title
      },
      template: path.resolve(
        root,
        'node_modules/@battis/webpack/template/bookmarklet',
        page
      ),
      filename: page,
      inject: false,
      hash: true
    });

  return {
    mode: 'production',
    entry: { main: './src/index.ts' },
    output: {
      path: path.resolve(root, 'build'),
      filename: 'bookmarklet.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    externals,
    plugins: [
      new CleanWebpackPlugin(),
      new Dotenv(),
      HtmlWebpackPage('install.html'),
      HtmlWebpackPage('embed.html'),
      new CreateFilePlugin({
        filename: 'README.md',
        content: `# ${package.name}

${package.description}

## Install

${require(path.resolve(root, 'build/embed.html'))}`
      })
    ],
    optimization: {
      minimize: true,
      minimizer: ['...', new TerserPlugin()],
      splitChunks: { chunks: 'all' }
    }
  };
};
