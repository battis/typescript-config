---
'@battis/webpack': major
---

Typescript Rewrite & Standard Options

I opted to rewrite the webpack configurations in Typescript to get the benefit of type and error-checking. In addition, this gave me an opportunity to externalize some standard processes that were being repeated across multiple scripts, thereby providing an avenue to standardizing the vast majority of options and behaviors for the scripts.

Most notably, the syntax for making use of the library and its components has changed to make it more clear in the source what's being done, and to make it more transparent how configuration changes will impact builds.

All dependencies have now been peered, with the push towards add-peer-dependencies if working in a monorepo (or using pnpm) to get away from fighting with .npmrc and generally make it less fidlly to get set up.
