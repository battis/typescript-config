import * as Plugin from '@qui-cli/plugin';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import path from 'node:path';
import confirm from '@inquirer/confirm';
import { Log } from '@qui-cli/log';
import { PathString, JSONValue } from '@battis/descriptive-types';
import type { IPackageJson } from 'package-json-type';
import * as yaml from 'yaml';
import ora from 'ora';

export type Configuration = Plugin.Configuration & {
  packageName?: string;
  setupDir?: PathString;
  force?: boolean;
};

export const name = '@battis/pkg-setup';
const config: Configuration = {
  setupDir: 'pkg-setup',
  force: false
};

export function configure(proposal: Configuration = {}) {
  for (const key in proposal) {
    if (proposal[key] !== undefined) {
      config[key] = proposal[key];
    }
  }
}

export function options(): Plugin.Options {
  return {
    man: [{ level: 1, text: `Setup Options` }],
    opt: {
      packageName: {
        description: 'Package name',
        short: 'p',
        default: config.packageName
      },
      setupDir: {
        description: 'Name of the setup template directory in the package',
        short: 'd',
        default: config.setupDir
      }
    },
    flag: {
      force: {
        description: `Force configuration, overwritting existing ${Colors.path(path.join(process.cwd(), '.prettierrc.json'), Colors.keyword)} without confirmation`,
        short: 'f',
        default: config.force
      }
    }
  };
}

export function init({ values }: Plugin.ExpectedArguments<typeof options>) {
  configure(values);
}

export async function run() {
  if (!config.packageName) {
    Log.error(`${Colors.optionArg('--packageName')} must be defined`);
    process.exit(1);
  }

  if (!config.setupDir) {
    Log.error(`${Colors.optionArg('--setupDir')} must be defined`);
    process.exit(2);
  }

  const destPackagePath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(destPackagePath)) {
    Log.error(
      `${Colors.command(process.argv[1])} can only be run at a package root`
    );
    process.exit(3);
  }

  let pkg: IPackageJson;
  try {
    pkg = JSON.parse(fs.readFileSync(destPackagePath, 'utf8'));
  } catch (_) {
    Log.error(
      `${Colors.path(destPackagePath, Colors.keyword)} could not be parsed`
    );
    process.exit(4);
  }

  if (!(
    (pkg.dependencies && config.packageName in pkg.dependencies) ||
    (pkg.devDependencies && config.packageName in pkg.devDependencies) ||
    (pkg.peerDependencies && config.packageName in pkg.peerDependencies)
  )) {
    Log.error(
      `${Colors.value(config.packageName)} must be a dependency of the local package`
    );
    process.exit(5);
  }

  const srcPath = path.join(
    process.cwd(),
    'node_modules',
    config.packageName,
    config.setupDir
  );

  if (!fs.existsSync(srcPath)) {
    Log.error(
      `Could not find source directory ${Colors.path(srcPath, Colors.keyword)}`
    );
    process.exit(6);
  }

  let packageChanged = false;
  let workspaceChanged = false;
  for (const filename of fs.readdirSync(srcPath)) {
    if (filename === 'package.json') {
      packageChanged = await confirmPackageUpdate(
        pkg,
        path.join(srcPath, filename),
        destPackagePath
      );
    } else if (filename === 'pnpm-workspace.yaml') {
      workspaceChanged = await confirmWorkspaceUpdate(
        path.join(srcPath, filename),
        path.join(process.cwd(), filename)
      );
    } else {
      if (!['.', '..', '.DS_Store'].includes(filename)) {
        await confirmCopy(
          path.join(srcPath, filename),
          path.join(process.cwd(), filename.replace(/^dot\./, '.'))
        );
      }
    }
  }

  if (packageChanged) {
    Log.info(
      Colors.error(
        `\nChanges have been made to ${Colors.path(path.join(process.cwd(), 'package.json'), Colors.keyword)}, please verify package dependency and build status`
      )
    );
  }
  if (workspaceChanged) {
    Log.info(
      Colors.error(
        `\nChanges have been made to ${Colors.path(path.join(process.cwd(), 'pnpm-workspace.yaml'), Colors.keyword)}, please verify lockfile status`
      )
    );
  }
}

async function confirmPackageUpdate(
  pkg: IPackageJson,
  srcPackagePath: PathString,
  destPackagePath: PathString
) {
  const proposal = JSON.parse(fs.readFileSync(srcPackagePath, 'utf8'));
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
      }
    );
  }
  if (changed) {
    fs.writeFileSync(destPackagePath, JSON.stringify(pkg, null, 2));
  }
  return changed;
}

async function confirmWorkspaceUpdate(
  srcWorkspacePath: PathString,
  destWorkspacePath: PathString
) {
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
        }
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

async function confirmCopy(srcPath: PathString, destPath: PathString) {
  await confirmWithDiff(
    fs.existsSync(srcPath) ? fs.readFileSync(srcPath, 'utf8') : undefined,
    fs.existsSync(destPath) ? fs.readFileSync(destPath, 'utf8') : undefined,
    Colors.path(destPath, Colors.keyword),
    () => fs.copyFileSync(srcPath, destPath)
  );
}

async function confirmWithDiff(
  src: unknown,
  dest: unknown,
  identifier: string,
  action: () => void | Promise<void>
) {
  const spinner = ora(identifier).start();
  if (src !== undefined) {
    if (dest !== undefined) {
      if (isEqual(src, dest)) {
        spinner.succeed(`${identifier} up-to-date`);
        return;
      }
      let update = config.force;
      if (!update) {
        spinner.clear();
        update = await confirm({
          message: `In ${identifier}, replace:\n${Log.syntaxColor(dest || 'null')}\nwith:\n${Log.syntaxColor(src || 'null')}\nConfirm?`
        });
      }
      if (update) {
        await action();
        if (config.force) {
          spinner.succeed(`${identifier} updated`);
        }
        return;
      }
    } else {
      await action();
      spinner.succeed(`${identifier} created`);
      return;
    }
  } else {
    spinner.fail(
      Colors.error(`${identifier} source missing in ${config.packageName}`)
    );
    return;
  }
}

function mergeJSONValues(src: JSONValue, dest: JSONValue) {
  if (typeof dest === 'object' && typeof src === 'object') {
    if (Array.isArray(dest) && Array.isArray(src)) {
      return [...new Set([...dest, ...src])];
    } else {
      return { ...dest, ...src };
    }
  } else {
    return src;
  }
}

function isEqual(a: unknown, b: unknown) {
  if (a && b) {
    if (typeof a === 'object' && typeof b === 'object') {
      if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length === b.length) {
          for (let i = 0; i < a.length; i++) {
            if (!isEqual(a[i], b[i])) {
              return false;
            }
          }
          return true;
        }
      } else {
        const keys = Object.keys(a) as (keyof typeof a)[];
        if (keys.length === Object.keys(b).length) {
          for (const key of keys) {
            if (!isEqual(a[key], b[key])) {
              return false;
            }
          }
          return true;
        }
      }
    }
  }
  return a === b;
}
