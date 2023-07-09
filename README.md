# @battis/babel

Boilerplate to compile both CommonJS and ES modules from "normal" typescript using Babel.

## Install

```
npm i -D @battis/babel npm-run-all shx
```

If using `pnpm`, a postinstall script will "shamefully" hoist the necessary packages.

## Usage

In `package.json`

```json
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "require": "./lib/cjs/index.js",
      "import": "./lib/esm/index.mjs",
      "default": "./lib/esm/index.mjs"
    }
  },
  "scripts": {
    "build": "run-s build:*",
    "build:clean": "shx rm -rf lib",
    "build:commonjs": "babel src --extensions .ts --out-dir lib/cjs --source-maps --config-file @battis/babel/cjs.json",
    "build:esm": "babel src --extensions .ts --out-dir lib/esm --out-file-extension .mjs --source-maps --config-file @battis/babel/esm.json",
    "build:types": "tsc",
  }
```

In `tsconfig.json`:

```json
{
  "extends": "@battis/babel/tsconfig.json",
  "compilerOptions": {
    "outDir": "lib/types"
  },
  "include": ["src"]
}
```
