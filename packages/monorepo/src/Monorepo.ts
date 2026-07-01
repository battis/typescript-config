import fs from 'node:fs';
import path from 'node:path';
import { Setup } from '@battis/pkg-setup';
import * as Plugin from '@qui-cli/plugin';
import { Shell } from '@qui-cli/shell';

export const name = '@battis/monorepo';
Setup.configure({ packageName: name });

export function run({ [Setup.name]: setup }: Plugin.Run.AccumulatedResults) {
  if (setup) {
    if (!fs.existsSync(path.join(process.cwd(), 'lerna.json'))) {
      Shell.exec('lerna init');
    }
  }
}
