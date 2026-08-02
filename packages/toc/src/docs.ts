import fs from 'node:fs';
import path from 'node:path';
import { Core } from '@qui-cli/core';
import { Markdown } from '@qui-cli/markdown';
import { register } from '@qui-cli/plugin';
import * as TOC from './TOC.js';

await register(TOC);

Markdown.configure({
  outputPath: path.join(import.meta.dirname, '../README.md'),
  pre: fs.readFileSync(
    path.join(import.meta.dirname, '../docs/pre.md'),
    'utf8'
  ),
  headingLevelAdjustment: 2,
  overwrite: true
});

await Core.init();
await Markdown.run();
