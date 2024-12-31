# @battis/babel

Boilerplate to compile both CommonJS and ES modules from "normal" typescript using Babel, with exported Typescript types to boot.

Still very much a moving target as I run into wrinkles in my own projects.

## Install

If using `pnpm`, in `.npmrc`:

```ini
public-hoist-pattern[]=*babel*
public-hoist-pattern[]=typescript
```

```bash
npm i -D @battis/babel npm-run-all del-cli
```

## Usage

```bash
npx babel-config
```

For options:

```bash
npx babel-config --help
```
