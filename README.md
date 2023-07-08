# @battis/eslint-config

Shared `eslint` config across all projects

### Install

```bash
npm i -D @battis/eslint-config@github:battis/eslint-config
```

Installing via `pnpm` also works and runs a postinstall script that "shamefully" hoists a bunch of dependencies.

### Usage

In `package.json`:

```json
{
  "eslintConfig": {
    "extends": "@battis/eslint-config"
  }
}
```
