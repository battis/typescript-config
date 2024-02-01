const path = require('path');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerWebpackPlugin = require('image-minimizer-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
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
  favicon = false,
  appName = false,
  production = true,
  terserOptions = undefined
}) => {
  const config = {
    mode: 'production',
    entry: { [bundle]: entry },
    output: {
      path: path.resolve(root, build),
      filename: 'assets/js/[name].[contenthash].js',
      publicPath: publicPath,
      clean: true
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
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name].[hash].[ext]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    externals: externals,
    plugins: [
      new Dotenv(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(root, template),
            to: path.resolve(root, build),
            filter: (filePath) => !/index\.html$/.test(filePath)
          }
        ]
      }),
      new HtmlWebpackPlugin({
        templateParameters: {
          PUBLIC_PATH: publicPath,
          APP_NAME: appName || bundle
        },
        template: path.resolve(root, template, 'index.html'),
        hash: true
      }),
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[contenthash].css'
      }),
      new ImageMinimizerWebpackPlugin({
        minimizer: {
          implementation: ImageMinimizerWebpackPlugin.imageminMinify,
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
  if (favicon) {
    config.plugins.push([
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(root, favicon, 'mask.svg'),
            to: path.resolve(root, build, 'assets/favicon/apple-mask-icon.svg')
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
            coast: false,
            favicons: false,
            firefox: false,
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
            appleStartup: false,
            coast: false,
            yandex: false
          },
          start_url: `${publicPath}/contexts/default`,
          scope: publicPath
        }
      })
    ]);
  }
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
