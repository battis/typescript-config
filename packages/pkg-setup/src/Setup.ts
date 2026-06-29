import * as Plugin from '@qui-cli/plugin';
import { Colors } from '@qui-cli/colors';
import fs from 'node:fs';
import path from 'node:path';
import confirm from '@inquirer/confirm';
import { Log } from '@qui-cli/log';
import { PathString } from '@battis/descriptive-types';
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
  if (config.packageName) {
    if (config.setupDir) {
      const destPackagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(destPackagePath)) {
        try {
          const pkg: IPackageJson = JSON.parse(
            fs.readFileSync(destPackagePath, 'utf8')
          );
          if (
            (pkg.dependencies && config.packageName in pkg.dependencies) ||
            (pkg.devDependencies &&
              config.packageName in pkg.devDependencies) ||
            (pkg.peerDependencies && config.packageName in pkg.peerDependencies)
          ) {
            const srcPath = path.join(
              process.cwd(),
              'node_modules',
              config.packageName,
              config.setupDir
            );
            if (fs.existsSync(srcPath)) {
              for (const filename of fs.readdirSync(srcPath)) {
                if (!['.', '..', '.DS_Store'].includes(filename)) {
                  const destPath = path.join(process.cwd(), filename);
                  if (
                    !fs.existsSync(destPath) ||
                    config.force ||
                    (await confirm({
                      message: `File ${Colors.path(destPath, Colors.keyword)} exists. Overwrite?`
                    }))
                  ) {
                    fs.copyFileSync(path.join(srcPath, filename), destPath);
                    Log.info(
                      `Created ${Colors.path(destPath, Colors.keyword)}`
                    );
                  } else {
                    Log.warning(
                      `${Colors.path(destPath, Colors.keyword)} left unchanged.`
                    );
                  }
                }
              }
              process.exit(0);
            } else {
              Log.error(
                `Could not find source directory ${Colors.path(srcPath, Colors.keyword)}`
              );
            }
          } else {
            Log.error(
              `${Colors.value(config.packageName)} must be a dependency of the local package`
            );
          }
        } catch (_) {
          Log.error(
            `${Colors.path(destPackagePath, Colors.keyword)} could not be parsed`
          );
        }
      } else {
        Log.error(
          `${Colors.command(process.argv[1])} can only be run at a package root`
        );
      }
    } else {
      Log.error(`${Colors.optionArg('--setupDir')} must be defined`);
    }
  } else {
    Log.error(`${Colors.optionArg('--packageName')} must be defined`);
  }
  process.exit(1);
}
