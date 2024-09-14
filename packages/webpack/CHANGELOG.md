# @battis/webpack

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
