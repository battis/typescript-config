# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.0.7](https://github.com/battis/typescript-config/compare/webpack/2.0.6...webpack/2.0.7) (2025-09-01)


### Bug Fixes

* use esmResolver for sass-loader ([6400a2c](https://github.com/battis/typescript-config/commit/6400a2c9e89216e8e952238ca17cfd2fb85de293))

## [2.0.6](https://github.com/battis/typescript-config/compare/webpack/2.0.5...webpack/2.0.6) (2025-08-09)


### Bug Fixes

* resolve webpack plugins in pnpm monorepo successfully ([0158005](https://github.com/battis/typescript-config/commit/0158005e2d3493a0ce80e5132e5eacdfa6d6d8db))

## [2.0.5](https://github.com/battis/typescript-config/compare/webpack/2.0.4...webpack/2.0.5) (2025-04-18)


### Bug Fixes

* **webpack:** include @tsconfig/recommended in peers ([99a1a2f](https://github.com/battis/typescript-config/commit/99a1a2f9f43b4845c94c8ba4cd0d7403b8a7b890))

## [2.0.4](https://github.com/battis/typescript-config/compare/webpack/2.0.3...webpack/2.0.4) (2025-03-01)


### Bug Fixes

* **webpack:** do not treat html files as images ([21ac5a3](https://github.com/battis/typescript-config/commit/21ac5a3d3ccf3cc04b0b321164cbc81b9f76f62c))

## [2.0.3](https://github.com/battis/typescript-config/compare/webpack/2.0.2...webpack/2.0.3) (2025-03-01)


### Bug Fixes

* **webpack:** remove overly-complex optional peer imagemin ([8b87dd1](https://github.com/battis/typescript-config/commit/8b87dd13ea3113632ee0cbf96477cca96b930920))

## 2.0.2

### Patch Changes

- 770c1ab: Licensing
  - add-peer-dependencies@0.1.10

## 2.0.1

### Patch Changes

- 0b131c8: loosen add-peer-dependencies version

## 2.0.0

### Major Changes

- 1393996: Removed module types

## 1.1.3

### Patch Changes

- 967e7a8: lose redundant clean-webpack-plugin
- Updated dependencies [e572655]
  - add-peer-dependencies@0.1.7

## 1.1.2

### Patch Changes

- c2cd6cf: esModuleInterop

## 1.1.1

### Patch Changes

- b4cb026: reworked scss imports

## 1.1.0

### Minor Changes

- a5c8168: bump dependencies

### Patch Changes

- Updated dependencies [a5c8168]
  - add-peer-dependencies@0.1.6

## 1.0.6

### Patch Changes

- 3544d03: shift sass to `modern` compiler

## 1.0.5

### Patch Changes

- 9a0f3eb: recommend add-peer-dependencie as peer dependency

## 1.0.4

### Patch Changes

- ccc8719: remove accidentally include html

## 1.0.3

### Patch Changes

- c4f3174: replace shx with del

  `del` (or, rather, `del-cli`) provides a safer, more-focused way of cleaning build directories.

## 1.0.2

### Patch Changes

- 94d046c: Fixed types

  Rather than exporting a non-module and/or confusing TS, types should now be both cleanly broken up into separate files for understandability and also importable into source. I hope.

## 1.0.1

### Patch Changes

- 383e378: Prune package published

## 1.0.0

### Major Changes

- 12667dc: Typescript Rewrite & Standard Options

  I opted to rewrite the webpack configurations in Typescript to get the benefit of type and error-checking. In addition, this gave me an opportunity to externalize some standard processes that were being repeated across multiple scripts, thereby providing an avenue to standardizing the vast majority of options and behaviors for the scripts.

  Most notably, the syntax for making use of the library and its components has changed to make it more clear in the source what's being done, and to make it more transparent how configuration changes will impact builds.

  All dependencies have now been peered, with the push towards add-peer-dependencies if working in a monorepo (or using pnpm) to get away from fighting with .npmrc and generally make it less fidlly to get set up.

## 0.4.8

### Patch Changes

- 6730759: bump dependencies

## 0.4.7

### Patch Changes

- 582c1ae: fix target default

## 0.4.6

### Patch Changes

- 921639c: .npmrc format change, peer dependencies

## 0.4.5

### Patch Changes

- b906e13: filename affects css export

## 0.4.4

### Patch Changes

- f67070b: add filename param

## 0.4.3

### Patch Changes

- fb0e467: type importing

## 0.4.2

### Patch Changes

- f7f9e02: tweak readmes, links

## 0.4.1

### Patch Changes

- 28bf17c: repo moved to @battis/typescript-config monorepo
