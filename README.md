# @battis/babel

Boilerplate to compile both CommonJS and ES modules from "normal" typescript using Babel.

## Install

If using `pnpm`, in `.npmrc`:

```ini
public-hoist-pattern[]=*babel*
public-hoist-pattern[]=typescript
```

```bash
npm i -D @battis/babel npm-run-all shx
```

## Usage

```bash
npx babel-config
```

For options:

```bash
npx babel-config --help
```
