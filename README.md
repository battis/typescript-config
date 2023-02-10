# @battis/eslint-config

In `.npmrc`:

```
auto-install-peers = true
```

```bash
pnpm add @battis/prettier-config@github:battis/prettier-config
```

In `package.json`:

```json
{
  ...
  "eslintConfig": {
    "extends": "@battis/eslint-config"
  }
  ...
}
```
