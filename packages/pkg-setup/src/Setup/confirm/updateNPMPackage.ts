import { PathString } from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import type { IPackageJson } from 'package-json-type';
import { mergeJSONValues } from '../mergeJSONValues.js';
import { withDiff } from './withDiff.js';
import { Configuration } from '../Configuration.js';

export async function updateNPMPackage(
  pkg: IPackageJson,
  srcPackagePath: PathString,
  destPackagePath: PathString,
  config: Configuration
) {
  const proposal = JSON.parse(fs.readFileSync(srcPackagePath, 'utf8'));
  let changed = false;
  for (const key in proposal) {
    const update = mergeJSONValues(proposal[key], pkg[key]);
    await withDiff(
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
    fs.writeFileSync(destPackagePath, JSON.stringify(pkg, null, 2));
  }
  return changed;
}
