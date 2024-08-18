# add-peer-dependencies

[![npm version](https://badge.fury.io/js/add-peer-dependencies.svg)](https://badge.fury.io/js/add-peer-dependencies)

Install/remove peer dependencies as direct dependencies

# Why

This addresses a fairly specific need that I've been running into and haven't found a more elegant way to address: `webpack` does not resolve modules in the same way as `pnpm` or `npm`. In general, this isn't a huge deal, but I have a bunch of re-usable webpack configurations that require a variety of peers... include `webpack` and `webpack-cli`.

In order to hoist these peers to a level of visibility where `webpack` can find them (especially when operating within a `pnpm` monorepo where all peers are hoisted to the root, rather than subpackage level), they have to be installed as direct dependencies of the package where `webpack needs to operate`.

# Install

```sh
npm i -D add-peer-dependencies
```

# Usage

To install peer dependencies:

```sh
npx add-peer-dependencies -w
```

To remove peer dependencies installed with this tool:

```sh
npx add-peer-dependencies -rw
```
