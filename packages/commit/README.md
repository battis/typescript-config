# @battis/commit

@battis's commit linting configuration

[![npm version](https://badge.fury.io/js/@battis%2Fcommit.svg)](https://npmjs.com/package/@battis/commit)
[![Module type: ESM](https://img.shields.io/badge/module%20type-esm-brightgreen)](https://nodejs.org/api/esm.html)

### Usage

```bash
npx @battis/commit
```

This can be optionally configured as a build step in `package.json`, to ensure continued consistency:

```json
{
  "scripts": {
    "build:commit": "setup-commit -f"
  },
  "devDependencies": {
    "@battis/commit": "0.x"
  }
}
```
