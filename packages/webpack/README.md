# @battis/webpack

[![npm version](https://badge.fury.io/js/@battis%2Fwebpack.svg)](https://badge.fury.io/js/@battis%2Fwebpack)
[![Module type: CJS](https://img.shields.io/badge/module%20type-cjs-brightgreen)](https://nodejs.org/api/modules.html#modules-commonjs-modules)

Reusable, extensible webpack configurations for different needs;

1. [Single Page App](#single-page-app): a generic single-page web app with manifest, favicons, etc. Supports TypeScript and SASS.
2. [Vanilla JS](#vanilla-js): develop in TypeScript and SASS, compile to minified, uglified vanilla JavaScript and CSS.
3. [Bookmarklet](#bookmarklet): build a bookmarklet in TypeScript and SASS, autogenerate JavaScript executable and documentation.

## Install

```bash
npm i -D @battis/webpack
```

if working in a monorepo or using `pnpm`, you may want to explore [`add-peer-dependencies`](../add-peer-dependencies).

## Usage

### `package.json`

```json
{
  "scripts": {
    "serve": "webpack serve",
    "build": "webpack"
  }
}
```

### `tsconfig.json`:

```json
{
  "extends": "@battis/webpack/tsconfig.json",
  "include": ["./src"]
}
```

### `src/index.ts`

If making use of more advanced features (e.g. importing images, using the `__webpack_hash__` variable, or using `style.module.scss` to import values between SCSS and TS):

```ts
/// <reference types="@battis/webpack/types" />
```

### `webpack.config.mjs`

```js
import bundle from `@battis/webpack`;

export default bundle.fromTS.toVanillaJS({
  root: import.meta.dirname
});
```

See [Choose Build](#choose-build) below.

#### Common Options

Optional unless otherwise indicated.

##### Script configuration

| Parameter         | Description                                                                                                                                                                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `root` (required) | Path to project root, where `package.json`, `webpack.config.mjs`, etc. reside. In general, `import.meta.dirname` is the right answer.                                                                                                                                       |
| `template`        | Path to template directory (if needed) relative to `root`, from which to draw static web templates that will be updated during the build. Defaults to `'template'`                                                                                                          |
| `bundle`          | Name of the module to bundle. Defaults to `'main'`                                                                                                                                                                                                                          |
| `production`      | Whether this is a production or development build (which includes a great deal more debugging information and takes up a a lot more space). Defaults to `true`                                                                                                              |
| `override`        | An object indicating which of the below Webpak configurations override, rather than extend the default configurationof the script. By default, all overrides are `false`. Possible overrides include `resolveExtensions`,`moduleRules`,`externals`,`plugins`,`optimization` |

##### Webpack configuration

| Parameter            | Description                                                                                                                                                                                         |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entry`              | Path to the entrypoint to the app relative to `root`. Defaults to `'src/index.ts'`                                                                                                                  |
| `output.path`        | Path to the desired output directory for the bundle, relative to `root`. Default varies depending on build, usually `'build'` or `'dist'`                                                           |
| `output.filename`    | Naming scheme for the bundle output. Default varies depending on build, usually `'[name].[contenthash]'`                                                                                            |
| `resolve.extensions` | An array of strings listing file extensions to be resolved by Webpack. Default varies depending on build                                                                                            |
| `module.rules`       | An array of Webpack rules for processing file types. Defeault varies depending on build                                                                                                             |
| `externals`          | An object defining modules that Webpack can externalize from the actual bundle (e.g. JQuery, lodash, etc.). Defaults to none.                                                                       |
| `plugins`            | An array of Webpack plugin instances to be applied to the bundle. Defaults vary depending on build, but always include [`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) |
| `optimization`       | Webpack optmization rules. Default varies depending on build                                                                                                                                        |
| `terserOptions`      | Configuration options for the Terser Plugin in the optimization configuration. Defaults vary depending on build                                                                                     |

## Choose build

### Single Page App

#### `webpack.config.mjs`

```js
import bundle from '@battis/webpack';

export default bundle.fromTS.toSPA({
  root: import.meta.dirname
});
```

Meant to build a single page app, including a manifest, favicons, image compression, etc.

#### Additional configuration options

| Parameter           | Description                                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `favicon`           | Path to favicon assets folder relative to `root`. Defaults is none. If defined, favicon resources will be processed. |
| `appName`           | Display name for the app. Defaults to `bundle` value                                                                 |
| `output.publicPath` | Public path to the web app                                                                                           |

#### SPA assets folder

```
📂favicon
 ∟ 📄 logo.svg
 ∟ 📄 manifest.json
 ∟ 📄 mask.svg
 ∟ 📄 startup.svg
```

### Vanilla JS

Meant to generate vanilla JavaScript for re-use in a browser.

#### `webpack.confg.mjs`

```js
import bundle from '@battis/webpack';

export default bundle.fromTS.toVanillaJS({
  root: import.meta.dirname
});
```

#### Additional configuration options

| Parameter    | Description                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `target`     | Webpack target value. Defaults to `'web'`, but `'node'` is useful for compiling node apps and libraries.               |
| `extractCSS` | Boolean value determining whether CSS is extracted as a separate file or embedded in the JS bundle. Defaults to `true` |

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

#### `webpack.config.mjs`

```js
import bundle from '@battis/webpack';

export default bundle.fromTS.toBookmarklet({
  root: import.meta.dirname,
  title: 'Click me!'
});
```

#### Additional configuration options

| Parameter          | Description                  |
| ------------------ | ---------------------------- |
| `title` (required) | Display name for bookmarklet |
