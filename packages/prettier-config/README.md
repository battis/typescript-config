# @battis/prettier-config

Shared Prettier configuration across all projects

### Install

```bash
npm i -D @battis/prettier-config
```

### Usage

In `.prettierrc.json`:

```json
"@battis/prettier-config"
```

In `.npmrc` (especially in monorepos using `pnpm`):

```ini
public-hoist-pattern[]=*prettier*
```
