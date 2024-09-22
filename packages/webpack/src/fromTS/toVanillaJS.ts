import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import Options from '../Options.js';

// TODO explore resolve.modules

type VanillaOptions = Options & {
  target?: webpack.Configuration['target'];
  extractCSS?: boolean;
};

export default function config({
  root,
  production = true,
  target = 'web',
  bundle = 'main',
  override,

  entry = './src/index.ts',
  output = {},
  resolve,
  externals = {},
  module,
  plugins = [],
  optimization,
  extractCSS = true,

  terserOptions
}: VanillaOptions): webpack.Configuration {
  output = {
    path: 'build',
    filename: '[name].[contenthash]',
    ...output
  };
  return {
    mode: Options.mode(production),
    target,
    entry: { [bundle]: entry },
    output: {
      path: path.resolve(root, output.path!),
      filename:
        path.extname(output.filename!) == '.js'
          ? output.filename
          : `${output.filename}.js`,
      clean: true
    },
    module: {
      rules: Options.resolve.moduleRules(
        [
          {
            test: /\.tsx?$/i,
            use: {
              loader: 'ts-loader',
              options: { allowTsInNodeModules: true }
            }
          },
          {
            test: /\.svg$/i,
            use: 'raw-loader'
          },
          {
            test: /\.(s[ac]ss|css)$/i,
            use: [
              extractCSS ? MiniCssExtractPlugin.loader : 'style-loader',
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
                options: { api: 'modern' }
              }
            ]
          },
          {
            test: /\.(jpe?g|gif|png)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'assets/images/[name].[hash].[ext]'
            }
          }
        ],
        override?.moduleRules,
        module?.rules
      )
    },
    resolve: {
      extensions: Options.resolve.resolveExtensions(
        ['.ts', '.js'],
        override?.resolveExtensions,
        resolve?.extensions
      )
    },

    externals,
    plugins: Options.resolve.plugins(
      [
        new CleanWebpackPlugin(),
        new Dotenv(),
        new MiniCssExtractPlugin({
          filename:
            path.extname(output.filename!) == '.js'
              ? '[name].[contenthash].css'
              : `${output.filename}.css`
        })
      ],
      override?.plugins,
      plugins
    ),
    optimization: Options.resolve.optimization(
      {
        minimize: production,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              mangle: { properties: true },
              ...terserOptions
            }
          }),
          new CssMinimizerWebpackPlugin()
        ],
        splitChunks: false
      },
      override?.optimization,
      optimization
    )
  };
}
