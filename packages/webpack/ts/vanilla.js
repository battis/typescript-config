const path = require('path');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// TODO explore resolve.modules

module.exports = ({
  root,
  production = true,
  target = false,
  bundle = 'main',
  filename = '[name].[contenthash]',
  entry = './src/index.ts',
  build = 'build',
  resolve = {},
  externals = {},
  config = {},
  rules = [],
  plugins = [],
  optimization = undefined
}) => {
  production = production ?? mode === 'production';
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
    mode: production ? 'production' : 'development',
    target,
    entry: { [bundle]: entry },
    output: {
      path: path.resolve(root, build),
      filename: path.extname(filename) == '.js' ? filename : `${filename}.js`,
      clean: true
    },
    module: {
      rules: config.overrideRules
        ? rules
        : [
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
            {
              test: /\.(jpe?g|gif|png)$/i,
              type: 'asset/resource',
              generator: {
                filename: 'assets/images/[name].[hash].[ext]'
              }
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
          new Dotenv(),
          new MiniCssExtractPlugin({
            filename:
              path.extname(filename) == '.js'
                ? '[name].[contenthash].css'
                : `${filename}.css`
          }),
          ...plugins
        ],
    optimization: optimization || {
      minimize: production,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            mangle: { properties: true },
            ...config.terserOptions
          }
        }),
        new CssMinimizerWebpackPlugin()
      ],
      splitChunks: false
    }
  };
};
