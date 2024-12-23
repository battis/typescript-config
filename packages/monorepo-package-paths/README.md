# monorepo-package-paths

Update workspace package manifests to use URLs relative to root package manifest

## Install

```sh
npm i -D monorepo-package-paths
```

## Usage

Not including the `--write` (or `-w`) flag is effectively a dry run, dumping changes to `stdout` or a log file, rather than changing manifests.

```sh
monorepo-package-paths -w
```

## Help

```sh
monorepo-package-paths --help
```
