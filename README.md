# @battis/eslint-config

In `.npmrc`:

```
auto-install-peers = true
```

```bash
npm i -D @battis/eslint-config@github:battis/eslint-config
```
or 
```bash
pnpm i -D --shamefully-hoist @battis/eslint-config@github:battis/eslint-config
```
(because not all tools are good about package resolution)

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
