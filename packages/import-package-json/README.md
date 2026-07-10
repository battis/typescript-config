# @battis/import-package-json

Import package files as typed objects locally or from [npm](https://npmjs.com)

[![npm version](https://badge.fury.io/js/@battis%import-package-json.svg)](https://npmjs.com/package/@battis/import-package-json)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

## Install

```bash
> npm install @battis/import-package-json
```

## Usage

```ts
import pkg from '@battis/import-package-json';

const myPkg = await pkg.importLocal('./package.json');
const monorepoPackagePaths = await pkg.fetchNPM(
  'monorepo-package-paths',
  '0.4.6'
);
const prettier = await pkg.importLocalWithNPMFallback('@battis/prettier');
```
