#!/usr/bin/env node

import pkg from '@battis/import-package-json';
import { Colors } from '@battis/qui-cli.colors';
import { Log } from '@battis/qui-cli.log';
import * as Plugin from '@battis/qui-cli.plugin';
import { Root } from '@battis/qui-cli.root';
import { Validators } from '@battis/qui-cli.validators';
import input from '@inquirer/input';
import fs from 'fs';
import { glob } from 'glob';
import ora from 'ora';
import path from 'path';
import YAML from 'yaml';

Root.configure({ root: process.cwd() });

type Configuration = Plugin.Configuration & {
  rootPackage?: string;
  repository?: boolean;
  author?: boolean;
  homepage?: boolean;
  homepagePrefix?: string;
  write?: boolean;
};

export const name = 'monorepo-package-paths';
export const src = import.meta.dirname;

let rootPackage = path.join(Root.path(), 'package.json');
let repository = true;
let author = true;
let homepage = true;
let homepagePrefix = 'tree/main';
let write = true;

export function configure(config: Configuration = {}) {
  rootPackage = Plugin.hydrate(config.rootPackage, rootPackage);
  repository = Plugin.hydrate(config.repository, repository);
  author = Plugin.hydrate(config.author, author);
  homepage = Plugin.hydrate(config.homepage, homepage);
  homepagePrefix = Plugin.hydrate(config.homepagePrefix, homepagePrefix);
  write = Plugin.hydrate(config.write, write);
}

export function options(): Plugin.Options {
  return {
    opt: {
      rootPackage: {
        short: 'p',
        description: `Path to monorepo root package file (default: ${Colors.url(
          rootPackage
        )})`,
        default: rootPackage
      },
      homepagePrefix: {
        short: 'x',
        description: `Prefix relative path URLs (default" ${Colors.quotedValue(
          `"${homepagePrefix}"`
        )} as for GitHub)`,
        default: homepagePrefix
      }
    },
    flag: {
      write: {
        short: 'w',
        description: `Write changes to workspace package files (default: ${Colors.value(write)})}`,
        default: write
      },
      repository: {
        description: `Update ${Colors.value(
          'package.repo.directory'
        )} (default: ${Colors.value(repository)}, ${Colors.value('--no-repository')} to disable)`,
        default: repository
      },
      homepage: {
        description: `Update ${Colors.value('package.homepage')} (default: ${Colors.value(homepage)}, ${Colors.value('--no-homepage')} to disable)`,
        default: homepage
      },
      author: {
        description: `Update ${Colors.value('package.author')} (default: ${Colors.value(author)}, ${Colors.value('--no-author')} to disable)`,
        default: author
      }
    }
  };
}

export function init(args: Plugin.ExpectedArguments<typeof options>) {
  configure(args.values);
}

export async function run() {
  const spinner = ora();

  if (!rootPackage) {
    throw new Error(`option ${Colors.value('--rootPackage')} must be defined`);
  }

  // TODO waiting on better typing in @battis/qui-cli
  if (!homepagePrefix) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    spinner.fail('Prettier not found, using basic JSON formatting');
  }

  rootPackage = path.resolve(Root.path(), rootPackage);
  spinner.start(`Loading ${Colors.url(rootPackage)}`);
  const monorepo = await pkg.importLocal(rootPackage);
  spinner.succeed(`Root package ${Colors.url(rootPackage)}`);

  let rootPath = rootPackage;
  if (!fs.lstatSync(rootPackage).isDirectory()) {
    rootPath = path.dirname(rootPackage);
  }

  const workspaces: string[] = [];

  if (monorepo.workspaces && monorepo.workspaces.length > 0) {
    workspaces.push(...monorepo.workspaces);
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

  const rootAuthor = author ? monorepo.author : undefined;

  const rootHomepage =
    homepage && monorepo.homepage ? new URL(monorepo.homepage) : undefined;

  const rootRepository =
    repository && monorepo.repository
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

  for (const workspace of workspaces) {
    const pathToWorkspace = path.join(rootPath, workspace);
    for (const packagePath of await glob(pathToWorkspace)) {
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
            homepagePrefix,
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

        if (write) {
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
          fs.writeFileSync(
            workspacePackagePath,
            prettier
              ? await prettier.format(JSON.stringify(updatedPackage), {
                  ...(await prettier.resolveConfig(workspacePackagePath)),
                  filepath: workspacePackagePath
                })
              : JSON.stringify(updatedPackage, null, 2) + '\n'
          );
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        spinner.fail(
          Colors.error(`Not found: ${`${Colors.url(workspaceRelativePath)}`}`)
        );
      }
    }
  }
}
