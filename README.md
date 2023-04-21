# @battis/webpack

## Install

In `.npmrc`:

```
auto-install-peers=true
public-hoist-pattern[]=*webpack*
public-hoist-pattern[]=*loader*
public-hoist-pattern[]=sass
public-hoist-pattern[]=postcss
public-hoist-pattern[]=imagemin*
public-hoist-pattern[]=favicons
```

```bash
pnpm i -D @battis/webpack@github:battis/webpack rimraf
```

In `webpack.config.js`:

```js
const config = require('@battis/webpack/ts/spa');

module.exports = config({ root: __dirname });
```

In `package.json`:

```json
{
  "scripts": {
    "clean": "rimraf build",
    "serve": "npx webpack serve",
    "build": "npx webpack"
  }
}
```

## Configure

Configuration options include, with defaults:

```ts
{
  root,
  bundle = 'main',
  entry = './src/index.ts',
  template = 'public',
  build = 'build',
  publicPath = '/',
  externals = {},
  favicon = false,
  appName = false,
}
```

#### `root`

**Required:** path to project root, usually `__dirname`

#### `bundle`

Name of bundle to be exported

#### `entry`

Path to entry point, relative to `root`

#### `template`

Path to template for build folder, relative to `root`. All files _except_ `index.html` while be copied.

#### `build`

Path to build output folder, relative to `root`.

#### `publicPath`

Web path to app on server

#### `externals`

[Webpack-defined object](https://webpack.js.org/configuration/externals/) defining externally-loaded libraries.

#### `favicon`

If `favicon` is `false`, favicons will be ignored. If it is set to a path relative to the `root` path, it will assume there is a directory with the following files, and use them to generate a SPA assets folder:

```
📂favicon
 ∟ 📄 logo.svg
 ∟ 📄 manifest.json
 ∟ 📄 mask.svg
 ∟ 📄 startup.svg
```

#### `appName`

Name of the app to display in title bar, etc. Defaults to the value of `bundle`
