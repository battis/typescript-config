import fs from 'node:fs';
import path from 'node:path';
import { Init } from '@qui-cli/init';
import * as Plugin from '@qui-cli/plugin';
import { Shell } from '@qui-cli/shell';
import { Colors } from '@qui-cli/colors';
import ora from 'ora';
import { Positionals } from '@qui-cli/core';

export const name = '@battis/monorepo';
Init.configure({
  enclosingDirectory: false,
  template: path.resolve(import.meta.dirname, '../template')
});
Positionals.requireAtLeast(0);

export function run({ [Init.name]: init }: Plugin.Run.AccumulatedResults = {}) {
  const spinner = ora(`Verifying ${Colors.command('lerna')} initialization`);
  if (init) {
    if (!fs.existsSync(path.join(process.cwd(), 'lerna.json'))) {
      Shell.configure({ showCommands: false, silent: true, logging: false });
      Shell.exec('lerna init');
      spinner.succeed(`${Colors.command('lerna')} initialized`);
    } else {
      spinner.succeed(`${Colors.command('lerna')} already initialized`);
    }
  } else {
    spinner.fail(
      `${Colors.command(process.argv[1])} failed, so ${Colors.command('lerna')} was not verified`
    );
  }
}
