import CopyWebpackPlugin from 'copy-webpack-plugin';
import CssMinimizerWebpackPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';
import 'webpack-dev-server';
import Options from '../Options.js';
import { esmResolver } from '../esmResolver.js';
// TODO explore resolve.modules

type SPAOptions = Options & {
  favicon?: string;
  appName?: string;
  output: { publicPath?: string };
};

export default async function config({
  root,
  favicon,
  appName,
  template = 'public',
  bundle = 'main',
  production = true,
  override,

  entry = './src/index.ts',
  output,
  resolve,
  externals,
  module,
  plugins,
  optimization,

  terserOptions
}: SPAOptions): Promise<webpack.Configuration> {
  output = {
    path: 'build',
    filename: 'assets/js/[name].[contenthash].js',
    publicPath: '/',
    ...output
  };

  const config: webpack.Configuration = {
    mode: Options.mode(production),
    entry: { [bundle]: { import: [entry] } },
    output: {
      path: path.resolve(root, output.path!),
      filename: output.filename!,
      publicPath: output.publicPath!,
      clean: true
    },
    resolve: {
      extensions: Options.resolve.resolveExtensions(
        ['.tsx', '.ts', '.js'],
        override?.resolveExtensions,
        resolve?.extensions
      )
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
            test: /\.svg$/,
            use: esmResolver('raw-loader')
          },
          {
            test: /\.s?[ac]ss$/,
            use: [
              MiniCssExtractPlugin.loader,
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
          },
          {
            test: /\.(jpe?g|gif|png)/,
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
    externals,
    plugins: Options.resolve.plugins(
      [
        new Dotenv(),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: path.resolve(root, template),
              to: path.resolve(root, output.path!),
              filter: (filePath) => !/index\.html$/.test(filePath)
            }
          ]
        }),
        new HtmlWebpackPlugin({
          templateParameters: {
            PUBLIC_PATH: output.publicPath!,
            APP_NAME: appName || bundle
          },
          template: path.resolve(root, template, 'index.html'),
          hash: true
        }),
        new MiniCssExtractPlugin({
          filename: 'assets/css/[name].[contenthash].css'
        })
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
          new CssMinimizerWebpackPlugin(),
          new ImageMinimizerPlugin({
            minimizer: {
              implementation: ImageMinimizerPlugin.imageminMinify,
              options: {
                plugins: [
                  ['gifsicle', { interlaced: true }],
                  ['jpegtran', { progresive: true }],
                  ['optipng', { optimizationLevel: 5 }],
                  ['svgo', { plugins: ['preset-default', 'prefixIds'] }]
                ]
              }
            }
          })
        ],
        splitChunks: { chunks: 'all' }
      },
      override?.optimization,
      optimization
    )
  };

  if (favicon) {
    config.plugins = [
      ...config.plugins!,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(root, favicon, 'mask.svg'),
            to: path.resolve(
              root,
              output.path!,
              'assets/favicon/apple-mask-icon.svg'
            )
          }
        ]
      }),
      new FaviconsWebpackPlugin({
        // startup screen
        logo: path.resolve(root, favicon, 'startup.svg'),
        outputPath: 'assets/startup/',
        prefix: 'assets/startup/',
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: true,
            favicons: false,
            windows: false,
            yandex: false
          }
        }
      }),
      new FaviconsWebpackPlugin({
        // favicons & manifest.json
        logo: path.resolve(root, favicon, 'favicon.svg'),
        outputPath: 'assets/favicon/',
        prefix: 'assets/favicon/',
        manifest: path.resolve(root, favicon, 'manifest.json'),
        favicons: {
          icons: {
            android: false,
            appleIcon: false,
            appleStartup: false,
            favicons: false,
            windows: false,
            yandex: false
          },
          start_url: `${output.publicPath!}/contexts/default`,
          scope: output.publicPath!
        }
      })
    ];
  }

  if (!production) {
    config.devtool = 'inline-source-map';
    config.module!.rules = config.module!.rules!.map((rule) => {
      if (
        rule &&
        rule != '...' &&
        rule.test instanceof RegExp &&
        rule.test.toString() == /\.s?[ac]ss$/.toString() &&
        rule.use &&
        Array.isArray(rule.use)
      ) {
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
}
