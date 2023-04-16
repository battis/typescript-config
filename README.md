# @battis/prettier-config

Shared Prettier configuration across all projects

### Install

In `.npmrc`:

```ini
auto-install-peers=true
public-hoist-pattern[]=*prettier*
```

```bash
pnpm i -D @battis/prettier-config@github:battis/prettier-config
```

In `package.json`:

```json
{
  "prettier": "@battis/prettier-config"
}
```
