import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import fs from 'node:fs';
import path from 'node:path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import Options from '../../Options.js';
import { esmResolver } from '../../esmResolver.js';

type BookmarkletOptions = Options & { title: string };

export default function config({
  root,
  template = 'template',
  bundle = 'bookmarklet',
  title,
  override,

  entry = 'src/index.ts',
  output,
  resolve,
  module,
  externals = {},
  plugins,
  optimization,

  terserOptions
}: BookmarkletOptions): webpack.Configuration {
  output = {
    path: 'build',
    filename: '[name].[contenthash].js',
    ...output
  };
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, 'package.json')).toString()
  );
  const [, owner = 'unknown', name = 'unknown'] =
    /.*\/github\.com\/([^/]+)\/([^/]+)\.git$/.exec(pkg.repository.url) || [];
  const repo = { owner, name };
  template = path.resolve(import.meta.dirname, template);
  const HtmlWebpackPage = (page: string) =>
    new HtmlWebpackPlugin({
      templateParameters: {
        REPO_OWNER: repo.owner,
        REPO_NAME: repo.name,
        TITLE: title || bundle
      },
      template: path.resolve(template, page),
      filename: page,
      inject: false,
      hash: true
    });

  return {
    mode: 'production',
    entry: { [bundle]: path.resolve(root, entry) },
    output: {
      path: path.resolve(root, output.path!),
      filename: output.filename!,
      clean: true
    },
    module: {
      rules: Options.resolve.moduleRules(
        [
          {
            test: /\.tsx?$/,
            use: {
              loader: esmResolver('ts-loader')
            }
          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              'style-loader',
              {
                loader: esmResolver('css-loader'),
                options: { importLoaders: 2 }
              },
              {
                loader: esmResolver('postcss-loader'),
                options: {
                  postcssOptions: {
                    plugins: ['postcss-preset-env']
                  }
                }
              },
              {
                loader: esmResolver('sass-loader'),
                options: { api: 'modern' }
              }
            ]
          }
        ],
        override?.moduleRules,
        module?.rules
      )
    },
    resolve: {
      extensions: Options.resolve.resolveExtensions(
        ['.tsx', '.ts', '.js'],
        override?.resolveExtensions,
        resolve?.extensions
      )
    },
    externals,
    plugins: Options.resolve.plugins(
      [
        new Dotenv(),
        HtmlWebpackPage('install.html'),
        HtmlWebpackPage('embed.html'),
        {
          apply: (compiler) => {
            compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
              const readme = fs.readFileSync(
                path.resolve(template, 'README.md'),
                'utf8'
              );
              const embed = fs.readFileSync(
                path.resolve(root, output!.path!, 'embed.html'),
                'utf8'
              );
              fs.writeFile(
                path.resolve(root, 'README.md'),
                readme
                  .replace('<%= REPO_NAME %>', repo.name)
                  .replace('<%= DESCRIPTION %>', pkg.description)
                  .replace('<%= EMBED %>', embed),
                (err) => err && console.error(err)
              );
            });
          }
        }
      ],
      override?.plugins,
      plugins
    ),
    optimization: Options.resolve.optimization(
      {
        minimize: true,
        minimizer: [
          '...',
          new TerserPlugin(terserOptions),
          new CssMinimizerWebpackPlugin()
        ],
        splitChunks: { chunks: 'all' }
      },
      override?.optimization,
      optimization
    )
  };
}
