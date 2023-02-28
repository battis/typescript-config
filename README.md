# @battis/eslint-config

Shared `eslint` config across all projects

### Install

In `.npmrc`:

```ini
auto-install-peers=true
public-hoist-pattern[]=prettier
public-hoist-pattern[]=*eslint*
public-hoist-pattern[]=@tsconfig/recommended
```

```bash
pnpm i -D @battis/eslint-config@github:battis/eslint-config
```

In `package.json`:

```json
{
  "eslintConfig": {
    "extends": "@battis/eslint-config"
  }
}
```
