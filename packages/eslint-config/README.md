# @battis/eslint-config

Shared `eslint` config across all projects

### Install

```bash
npm i -D @battis/eslint-config
```

### Usage

In `eslint.config.mjs`:

```json
export { default as default } from '@battis/eslint-config';
```

In `.npmrc` (especially in monorepos using `pnpm`):

```ini
public-hoist-pattern[]=*eslint*
```