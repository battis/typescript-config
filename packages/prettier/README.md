# @battis/prettier

@battis's code formatting configuration (using [Prettier](https://prettier.io/))

[![npm version](https://badge.fury.io/js/@battis%2Fprettier.svg)](https://npmjs.com/package/@battis/prettier)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

### Install

```bash
npx @battis/prettier
```

This can be optionally configured as a build step in `package.json`, to ensure continued consistency:

```json
{
  "scripts": {
    "build:prettier": "setup-prettier -f"
  },
  "devDependencies": {
    "@battis/prettier": "2.x"
  }
}
```
