import { PathString } from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import * as yaml from 'yaml';
import { mergeJSONValues } from '../mergeJSONValues.js';
import { withDiff } from './withDiff.js';
import { Configuration } from '../Configuration.js';

export async function updatePNPMWorkspace(
  srcWorkspacePath: PathString,
  destWorkspacePath: PathString,
  config: Configuration
) {
  let changed = false;
  if (fs.existsSync(destWorkspacePath)) {
    const workspace = yaml.parse(fs.readFileSync(destWorkspacePath, 'utf8'));
    const proposal = yaml.parse(fs.readFileSync(srcWorkspacePath, 'utf8'));
    for (const key in proposal) {
      const update = mergeJSONValues(proposal[key], workspace[key]);
      await withDiff(
        update,
        workspace[key],
        Colors.value(`pnpm-workspace.yaml#${key}`),
        () => {
          workspace[key] = update;
          changed = true;
        },
        config
      );
    }
    if (changed) {
      fs.writeFileSync(destWorkspacePath, yaml.stringify(workspace));
    }
  } else {
    fs.copyFileSync(srcWorkspacePath, destWorkspacePath);
    changed = true;
  }
  return changed;
}
