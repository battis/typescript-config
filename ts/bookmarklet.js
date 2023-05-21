const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const fs = require('fs');

module.exports = ({ root, package, title, externals = {} }) => {
  const HtmlWebpackPage = (page) =>
    new HtmlWebpackPlugin({
      templateParameters: {
        REPO_OWNER: package.repository.url.replace(
          /.*\/github\.com\/([^/]+)\/.*/,
          '$1'
        ),
        REPO_NAME: package.repository.url.replace(
          /.*\/github\.com\/[^/]+\/([^/]+)\/.*/,
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
      {
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
            const readme = fs.readFileSync(
              path.resolve(
                root,
                'node_modules/@battis/webpack/template/bookmarklet/readme.md'
              ),
              'utf8'
            );
            const embed = fs.readFileSync(
              path.resolve(root, 'build/embed.html'),
              'utf8'
            );
            fs.writeFile(
              path.resolve(root, 'README.md'),
              readme
                .replace(
                  '<%= REPO_NAME %>',
                  package.repository.url.replace(
                    /.*\/github\.com\/[^/]+\/([^/]+)\/.*/,
                    '$1'
                  )
                )
                .replace('<%= DESCRIPTION %>', package.description)
                .replace('<%= EMBED %>', embed),
              (err) => err && console.error(err)
            );
          });
        }
      }
    ],
    optimization: {
      minimize: true,
      minimizer: ['...', new TerserPlugin()],
      splitChunks: { chunks: 'all' }
    }
  };
};
