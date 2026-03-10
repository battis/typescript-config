# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.8.1](https://github.com/battis/typescript-config/compare/typescript-tricks/0.8.0...typescript-tricks/0.8.1) (2026-03-10)


### Features

* isIterable() ([38044eb](https://github.com/battis/typescript-config/commit/38044ebd2b76068c57829df55666a6216bd0f0e0))


### Bug Fixes

* increased type-safety on isEntries key-checking ([1ec0979](https://github.com/battis/typescript-config/commit/1ec097918c40e8332723c8a4d8f8d417130658a5))

## [0.8.0](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.9...typescript-tricks/0.8.0) (2026-03-07)


### ⚠ BREAKING CHANGES

* deprecate getEnumValue in favor of normal TypeScript usage
* deprecate Mixin
* deprecate Constructor and related methods
* deprecate Nullable, Optional, AssociativeArray, JSONPrimitiveTypes, Subset
* deprecate Coerce
* deprecate isError and CoerceError, preferring built-in Error.isError

### Features

* describe generic keyof types (string|number|symbol) as Key ([47a89d9](https://github.com/battis/typescript-config/commit/47a89d9a7fc7df631fccbbe666eed3dfb675dc40))
* identify an array of entries with isEntries() ([e97da7a](https://github.com/battis/typescript-config/commit/e97da7ac3bac43f109ff989e252665a7f5c34868))
* identify keys and keys of objects with isKey() and isKeyof() ([87aedd8](https://github.com/battis/typescript-config/commit/87aedd82ee4ab0e45f71fa7fa52dd4803fcfe207))
* optional type detection with isRecord() ([c26b5b7](https://github.com/battis/typescript-config/commit/c26b5b7a4b65ce5ff8cd3ab09e8aa6738fde4479))


### Bug Fixes

* deprecate Coerce ([3060632](https://github.com/battis/typescript-config/commit/306063272093426f8c910261dd8a65d6a5c31dbb))
* deprecate Constructor and related methods ([d01206e](https://github.com/battis/typescript-config/commit/d01206e5cfa283a5cc74fe830c27126253465086))
* deprecate getEnumValue in favor of normal TypeScript usage ([1516b04](https://github.com/battis/typescript-config/commit/1516b04279165c031d8b64312d6fb0860f565442))
* deprecate isError and CoerceError, preferring built-in Error.isError ([7f65938](https://github.com/battis/typescript-config/commit/7f659388a7ea8fabd208a1747ec184eb6803fdb9))
* deprecate Mixin ([b25266d](https://github.com/battis/typescript-config/commit/b25266d61cfb3c9d648997bc415a9dc539e37a83))
* deprecate Nullable, Optional, AssociativeArray, JSONPrimitiveTypes, Subset ([c3730d1](https://github.com/battis/typescript-config/commit/c3730d1e3797167c2d93e84abc916787dc406385))

## [0.7.9](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.8...typescript-tricks/0.7.9) (2026-03-07)


### Bug Fixes

* testing that FormData is not (really) a Record ([a32e806](https://github.com/battis/typescript-config/commit/a32e806669c9f0290c47ce21ffec0f2a7fd907c0))

## [0.7.8](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.7...typescript-tricks/0.7.8) (2026-03-06)


### Bug Fixes

* improve typechecking ([af6a06e](https://github.com/battis/typescript-config/commit/af6a06ede72238bdc046dfed0dafcb33fc177fcc))

## [0.7.7](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.6...typescript-tricks/0.7.7) (2026-02-10)


### Features

* isRecord<K,V>() ([fcc23b4](https://github.com/battis/typescript-config/commit/fcc23b49b0d0c2945d104f7dc88c1c902b582e0c))

## [0.7.6](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.5...typescript-tricks/0.7.6) (2026-01-04)


### Bug Fixes

* include null as possible JSONPrimitive ([6f2aa04](https://github.com/battis/typescript-config/commit/6f2aa043a1b201f54d975a81bdc256c5feeb6989))

## [0.7.5](https://github.com/battis/typescript-config/compare/typescript-tricks/0.7.4...typescript-tricks/0.7.5) (2025-11-11)


### Features

* tjjfvi's OneOf type ([bf3a78d](https://github.com/battis/typescript-config/commit/bf3a78d834079029e2aa2da5313bc8387f1239c5))

## 0.7.4

### Patch Changes

- 770c1ab: Licensing

## 0.7.3

### Patch Changes

- 5e67cc8: OptionalProperty

## 0.7.2

### Patch Changes

- 66ec81d: CoerceError without losing stack

## 0.7.1

### Patch Changes

- 1a87af4: npmignore fixed

## 0.7.0

### Minor Changes

- 837e093: ArrayElement<T>

## 0.6.1

### Patch Changes

- 51a7a9f: consistent caps

## 0.6.0

### Minor Changes

- 377d538: Coerce

## 0.5.6

### Patch Changes

- a5c8168: bump dependencies

## 0.5.5

### Patch Changes

- c4f3174: replace shx with del

  `del` (or, rather, `del-cli`) provides a safer, more-focused way of cleaning build directories.

## 0.5.4

### Patch Changes

- 56068c1: FormElements

## 0.5.3

### Patch Changes

- f97ced8: fiddling with dist

## 0.5.2

### Patch Changes

- 6730759: bump dependencies

## 0.5.1

### Patch Changes

- 28bf17c: repo moved to @battis/typescript-config monorepo
