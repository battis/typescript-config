import { PathString } from '@battis/descriptive-types';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import * as yaml from 'yaml';
import { mergeJSONValues } from '../mergeJSONValues.js';
import { confirmWithDiff } from '../confirmWithDiff.js';
import { Configuration, FileHandler } from '../Configuration.js';
import path from 'node:path';

export const PNPMWorkspace: FileHandler = async (
  srcWorkspacePath: PathString,
  destWorkspacePath: PathString,
  config: Configuration
) => {
  let changed = false;
  if (fs.existsSync(destWorkspacePath)) {
    const workspace = yaml.parse(fs.readFileSync(destWorkspacePath, 'utf8'));
    const proposal = yaml.parse(fs.readFileSync(srcWorkspacePath, 'utf8'));
    for (const key in proposal) {
      const update = mergeJSONValues(proposal[key], workspace[key]);
      await confirmWithDiff(
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
    return `Changes have been made to ${Colors.path(path.join(process.cwd(), 'pnpm-workspace.yaml'), Colors.keyword)}, please verify lockfile status`;
  }
};
