import * as Plugin from '@qui-cli/plugin';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import path from 'node:path';
import confirm from '@inquirer/confirm';
import { Log } from '@qui-cli/log';
import { PathString, JSONValue } from '@battis/descriptive-types';
import type { IPackageJson } from 'package-json-type';

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

  for (const filename of fs.readdirSync(srcPath)) {
    if (filename === 'package.json') {
      await confirmPackageUpdate(
        pkg,
        path.join(srcPath, filename),
        destPackagePath
      );
    } else {
      if (!['.', '..', '.DS_Store'].includes(filename)) {
        await confirmCopy(
          path.join(srcPath, filename),
          path.join(process.cwd(), filename)
        );
      }
    }
  }
}

async function confirmPackageUpdate(
  pkg: IPackageJson,
  srcPackagePath: PathString,
  destPackagePath: PathString
) {
  const proposal = JSON.parse(fs.readFileSync(srcPackagePath, 'utf8'));
  for (const key in proposal) {
    const update = mergeJSONValues(proposal[key], pkg[key]);
    const identifier = Colors.value(`package.${key}`);
    if (
      !pkg[key] ||
      (await confirm({
        message: `Review proposed changes to ${identifier}:\n${Log.syntaxColor({ current: pkg[key], update: proposal[key], result: update })}\n\nAllow update?`
      }))
    ) {
      pkg[key] = update;
      Log.info(`${identifier} updated`);
    } else {
      Log.warning(`${identifier} left unchanged`);
    }
  }
  fs.writeFileSync(destPackagePath, JSON.stringify(pkg, null, 2));
}

function mergeJSONValues(src: JSONValue, dest: JSONValue) {
  if (typeof dest === 'object' && typeof src === 'object') {
    if (Array.isArray(dest) && Array.isArray(src)) {
      return [...dest, ...src];
    } else {
      return { ...dest, ...src };
    }
  } else {
    return src;
  }
}

async function confirmCopy(srcPath: PathString, destPath: PathString) {
  if (
    !fs.existsSync(destPath) ||
    config.force ||
    (await confirm({
      message: `File ${Colors.path(destPath, Colors.keyword)} exists. Overwrite?`
    }))
  ) {
    fs.copyFileSync(srcPath, destPath);
    Log.info(`Created ${Colors.path(destPath, Colors.keyword)}`);
  } else {
    Log.warning(`${Colors.path(destPath, Colors.keyword)} left unchanged.`);
  }
}
