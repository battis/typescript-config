# @battis/webpack

Reusable, extensible webpack configurations for different needs;

1. [Single Page App](#single-page-app): a generic single-page web app with manifest, favicons, etc. Supports TypeScript and SASS.
2. [Vanilla JS](#vanilla-js): develop in TypeScript, compile to minified, uglified vanilla JavaScript.
3. [Bookmarklet](#bookmarklet): build a bookmarklet in TypeScript, autogenerate JavaScript executable and documentation.

## Install

### `.npmrc`

if using `pnpm`:

```
auto-install-peers=true
public-hoist-pattern[]=*prettier*
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=@tsconfig/recommended
public-hoist-pattern[]=*webpack*
public-hoist-pattern[]=*loader*
public-hoist-pattern[]=sass
public-hoist-pattern[]=postcss
public-hoist-pattern[]=imagemin*
public-hoist-pattern[]=favicons
```

```bash
pnpm i -D @battis/webpack@github:battis/webpack
```

### `webpack.config.js`

See [Choose Build](#choose-build) below.

### `package.json`

```json
{
  "scripts": {
    "serve": "npx webpack serve",
    "build": "npx webpack"
  }
}
```

### `tsconfig.json`:

```json
{
  "extends": "@battis/webpack/ts/tsconfig.json"
}
```

## Choose build

### Single Page App

#### `webpack.config.js`

```js
module.exports = require('@battis/webpack/ts/spa')({
  root: __dirname
});
```

Meant to build a single page app, including a manifest, favicons, image compression, etc.

Configuration options include, with defaults:

| Parameter                  | Description                                                                                                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root`                     | **Required:** path to project root, usually `__dirname`                                                                                                                                                                                  |
| `bundle = 'main'`          | Name of bundle to be exported                                                                                                                                                                                                            |
| `entry = './src/index.ts'` | Path to entry point, relative to `root`                                                                                                                                                                                                  |
| `template = 'public'`      | Path to template for build folder, relative to `root`. All files _except_ `index.html` while be copied. `index.html` will be built using the HtmlWebpackPlugin, with the assets injected.                                                |
| `build = 'build'`          | Path to build output folder, relative to `root`.                                                                                                                                                                                         |
| `publicPath = '/'`         | Web path to app on server                                                                                                                                                                                                                |
| `externals = {}`           | [Webpack-defined object](https://webpack.js.org/configuration/externals/) defining externally-loaded libraries.                                                                                                                          |
| `favicon = false`          | If `favicon` is `false`, favicons will be ignored. If it is set to a path relative to the `root` path, it will assume there is a directory with the following files, and use them to generate a [SPA assets folder](#spa-assets-folder). |
| `appName = false`          | Name of the app to display in title bar, etc. Defaults to the value of `bundle`                                                                                                                                                          |

###### SPA assets folder

```
📂favicon
 ∟ 📄 logo.svg
 ∟ 📄 manifest.json
 ∟ 📄 mask.svg
 ∟ 📄 startup.svg
```

### Vanilla JS

#### `webpack.confg.js`

```js
module.exports = require('@battis/webpack/ts/vanilla')({
  root: __dirname
});
```

Meant to generate vanilla JavaScript for re-use in a browser.

| Parameter                  | Description                                                                                                     |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `root`                     | **Required:** path to project root, usually `__dirname`                                                         |
| `bundle = 'main'`          | Name of bundle to be exported                                                                                   |
| `entry = './src/index.ts'` | Path to entry point, relative to `root`                                                                         |
| `build = 'build'`          | Path to build output folder, relative to `root`.                                                                |
| `externals = {}`           | [Webpack-defined object](https://webpack.js.org/configuration/externals/) defining externally-loaded libraries. |

#### `package.json`

If, in fact, the resulting code is meant to be deployed in a browser, add the following to your package:

```json
{
  ...
  "eslintConfig": {
    ...
    "env": {
      "browser": true
    }
  },
}
```

### Bookmarklet

For generating a bookmarklet and accompanying documentation. The assumed project structure:

```
📂project
 ∟ 📄 package.json
 ∟ 📄 tsconfig.json
 ∟ 📄 webpack.config.js
 ∟ 📂src
   ∟ 📄 index.ts
```

This will generate the following files:

```
📂project
 ∟ 📄 README.md
 ∟ 📂build
   ∟ 📄 bookmarklet.js
   ∟ 📄 embed.html
   ∟ 📄 install.html
```

`bookmarklet.js` is the actual bookmarklet executable. `install.html` is a preformatted page that guides the user through a drag-and-drop install of the bookmarklet. `embed.html` is the `<iframe/>` embed code for the install page. `README.md` displays basic information about the package, including the embedded install page.

#### GitHub Pages

This assumes that GitHub Pages has been enabled for the repo, deployed from the `main` branch root.

#### `webpack.config.js`

```js
module.exports = require('@battis/webpack/ts/bookmarklet')({
  root: __dirname,
  title: 'Click me!',
  package: require('./package.json')
});
```

| Parameter        | Description                                                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `root`           | **Required:** path to project root, usually `__dirname`                                                                            |
| `title`          | **Required** the title of the bookmarklet                                                                                          |
| `package`        | **Required** either the `package.json` file itself, or a JSON object that includes the `repository` configuration for the package. |
| `externals = {}` | [Webpack-defined object](https://webpack.js.org/configuration/externals/) defining externally-loaded libraries.                    |
