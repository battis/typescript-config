#!/usr/bin/env node

import pkg from '@battis/import-package-json';
import { Validators } from '@battis/qui-cli.validators';
import input from '@inquirer/input';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import * as Plugin from '@qui-cli/plugin';
import { Root } from '@qui-cli/root';
import fs from 'fs';
import { glob } from 'glob';
import ora from 'ora';
import path from 'path';
import YAML from 'yaml';

Root.configure({ root: process.cwd() });

type Configuration = Plugin.Configuration & {
  monorepoRoot?: string;
  repository?: boolean;
  author?: boolean;
  homepage?: boolean;
  homepagePrefix?: string;
  write?: boolean;
};

export const name = 'monorepo-package-paths';

const config: Configuration = {
  monorepoRoot: path.join(Root.path(), 'package.json'),
  repository: true,
  author: true,
  homepage: true,
  homepagePrefix: 'tree/main',
  write: true
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
    man: [{ level: 1, text: 'Monorepo Package Paths options' }],
    opt: {
      monorepoRoot: {
        short: 'p',
        description: 'Path to monorepo root package file',
        default: config.monorepoRoot
      },
      homepagePrefix: {
        short: 'x',
        description: 'Prefix relative path URLs',
        default: config.homepagePrefix
      }
    },
    flag: {
      write: {
        short: 'w',
        description: 'Write changes to workspace package files',
        default: config.write
      },
      repository: {
        description: `Update ${Colors.value('package.repo.directory')}`,
        default: config.repository
      },
      homepage: {
        description: `Update ${Colors.value('package.homepage')}`,
        default: config.homepage
      },
      author: {
        description: `Update ${Colors.value('package.author')}`,
        default: config.author
      }
    }
  };
}

export function init(args: Plugin.ExpectedArguments<typeof options>) {
  configure(args.values);
}

export async function run() {
  const spinner = ora();

  if (!config.monorepoRoot) {
    throw new Error(`option ${Colors.value('--monorepoRoot')} must be defined`);
  }

  // TODO waiting on better typing in @battis/qui-cli
  if (!config.homepagePrefix) {
    throw new Error(
      `option ${Colors.value('--homepagePrefix')} must be defined`
    );
  }

  // TODO waiting on better typing in @battis/qui-cli
  spinner.start('Checking for Prettier');
  let prettier;
  try {
    prettier = await import('prettier');
    spinner.succeed('Prettier');
  } catch (_) {
    spinner.fail('Prettier not found, using basic JSON formatting');
  }

  let rootPath = path.resolve(Root.path(), config.monorepoRoot);
  spinner.start(`Loading ${Colors.url(rootPath)}`);
  const monorepo = await pkg.importLocal(rootPath);
  spinner.succeed(`Root package ${Colors.url(rootPath)}`);

  if (!fs.lstatSync(rootPath).isDirectory()) {
    rootPath = path.dirname(rootPath);
  }

  const workspaces: string[] = [];

  if (monorepo.workspaces) {
    if (Array.isArray(monorepo.workspaces)) {
      workspaces.push(...monorepo.workspaces);
    } else {
      if (monorepo.workspaces.packages) {
        workspaces.push(...monorepo.workspaces.packages);
      }
      if (monorepo.workspaces.nohoist) {
        workspaces.push(...monorepo.workspaces.nohoist);
      }
    }
    spinner.succeed(
      `Workspaces defined in root ${Colors.value('package.json')}`
    );
  } else {
    spinner.warn(
      `No workspaces defined in root ${Colors.value('package.json')}`
    );
  }

  const pnpmWorkspace = path.resolve(rootPath, 'pnpm-workspace.yaml');
  spinner.start(`Searching for ${Colors.url(pnpmWorkspace)}`);
  if (fs.existsSync(pnpmWorkspace)) {
    workspaces.push(
      ...(YAML.parse(fs.readFileSync(pnpmWorkspace).toString()).packages || [])
    );
    spinner.succeed(`PNPM workspace ${Colors.url(pnpmWorkspace)}`);
  } else {
    spinner.warn(`No PNPM workspace definition`);
  }

  if (workspaces.length === 0) {
    spinner.fail(`No workspace definitions found`);
    process.exit(0);
  }

  const rootAuthor = config.author ? monorepo.author : undefined;

  const rootHomepage =
    config.homepage && monorepo.homepage
      ? new URL(monorepo.homepage)
      : undefined;

  const rootRepository =
    config.repository && monorepo.repository
      ? {
          url:
            typeof monorepo.repository == 'string'
              ? monorepo.repository
              : monorepo.repository.url,
          type:
            typeof monorepo.repository == 'string'
              ? await input({
                  message: 'What type of repository is being used?',
                  default: 'git',
                  validate: Validators.notEmpty
                })
              : monorepo.repository.type
        }
      : undefined;

  let packagePaths: string[] = [];
  for (const workspace of workspaces) {
    if (/^!/.test(workspace)) {
      const ignorePath = path.join(rootPath, workspace.replace(/^!/, ''));
      packagePaths = packagePaths.filter((p) => p !== ignorePath);
    } else {
      packagePaths.push(
        ...(await glob(path.join(rootPath, workspace))).filter((p) =>
          fs.statSync(p).isDirectory()
        )
      );
    }
  }

  for (const packagePath of packagePaths) {
    const workspaceRelativePath = packagePath.replace(
      new RegExp(`^${rootPath}/`),
      ''
    );
    spinner.start(Colors.url(workspaceRelativePath));
    const workspacePackagePath = path.join(packagePath, 'package.json');
    try {
      const workspacePackage = await pkg.importLocal(workspacePackagePath);

      let workspaceHomepage: string | URL | undefined =
        workspacePackage.homepage;
      if (rootHomepage) {
        workspaceHomepage = workspaceHomepage
          ? new URL(workspaceHomepage)
          : new URL(rootHomepage);
        workspaceHomepage.pathname = path.join(
          rootHomepage.pathname,
          config.homepagePrefix,
          workspaceRelativePath
        );
      }

      let workspaceRepository = workspacePackage.repository;
      if (rootRepository) {
        workspaceRepository = {
          ...rootRepository,
          directory: workspaceRelativePath
        };
      }

      if (config.write) {
        const updatedPackage = { ...workspacePackage };
        if (rootAuthor) {
          updatedPackage.author = rootAuthor;
        }
        if (workspaceHomepage) {
          updatedPackage.homepage = workspaceHomepage.toString();
        }
        if (workspaceRepository) {
          updatedPackage.repository = workspaceRepository;
        }
        let json = JSON.stringify(updatedPackage, null, 2) + '\n';
        if (prettier) {
          try {
            json = await prettier.format(json, {
              ...(await prettier.resolveConfig(workspacePackagePath)),
              filepath: workspacePackagePath
            });
          } catch (_) {
            spinner.warn(
              `Prettier is installed but failed to format ${Colors.url(workspaceRelativePath)}: make sure that there is an ${Colors.value('.npmrc')} file defined in the repo root that defines at least ${Colors.value('public-hoist-pattern[]')}=${Colors.regexpValue('*prettier*')}.`
            );
          }
        }
        fs.writeFileSync(workspacePackagePath, json);
        spinner.succeed(`Updated ${Colors.url(workspaceRelativePath)}`);
      } else {
        const summary: Record<string, unknown> = {
          name: workspacePackage.name
        };
        if (rootAuthor) {
          summary['author'] = rootAuthor;
        }
        if (workspaceHomepage) {
          summary['homepage'] = workspaceHomepage.toString();
        }
        if (workspaceRepository) {
          summary['repository'] = workspaceRepository;
        }
        spinner.succeed(`Computed ${Colors.url(workspaceRelativePath)}`);
        Log.info(
          prettier
            ? await prettier.format(JSON.stringify(summary), {
                ...(await prettier.resolveConfig(workspacePackagePath)),
                filepath: workspacePackagePath
              })
            : JSON.stringify(summary, null, 2) + '\n'
        );
      }
    } catch (_) {
      spinner.fail(
        Colors.error(`Not found: ${`${Colors.url(workspaceRelativePath)}`}`)
      );
    }
  }
}
