import { PathString } from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import type { IPackageJson } from 'package-json-type';
import { mergeJSONValues } from '../mergeJSONValues.js';
import { confirmWithDiff } from '../confirmWithDiff.js';
import { Configuration, FileHandler } from '../Configuration.js';
import path from 'node:path';

export const NPMPackage: FileHandler = async (
  srcPath: PathString,
  destPath: PathString,
  config: Configuration
) => {
  const pkg: IPackageJson = JSON.parse(fs.readFileSync(destPath, 'utf8'));
  const proposal = JSON.parse(fs.readFileSync(srcPath, 'utf8'));
  let changed = false;
  for (const key in proposal) {
    const update = mergeJSONValues(proposal[key], pkg[key]);
    await confirmWithDiff(
      update,
      pkg[key],
      Colors.value(`package.${key}`),
      () => {
        pkg[key] = update;
        changed = true;
      },
      config
    );
  }
  if (changed) {
    fs.writeFileSync(destPath, JSON.stringify(pkg, null, 2));
    return `Changes have been made to ${Colors.path(path.join(process.cwd(), 'package.json'), Colors.keyword)}, please verify package dependency and build status`;
  }
};
