# @battis/prettier-config

In `.npmrc`:

```
auto-install-peers = true
```

```bash
npm i -D @battis/prettier-config@github:battis/prettier-config
```
or
```bash
pnpm i -D --shamefully-hoist @battis/prettier-config@github:battis/prettier-config
```
(Because not all tools are good about package resolution)

In `package.json`:

```json
{
  ...
  "prettier": "@battis/prettier-config"
  ...
}
```
