import pkg from '@battis/import-package-json';
import cli from '@battis/qui-cli';
import fs from 'fs';
import { glob } from 'glob';
import { IRepository } from 'package-json-type';
import path from 'path';
import YAML from 'yaml';

const CWD = process.cwd();
let packagePath = path.join(CWD, 'package.json');

const args = cli.init({
  env: { root: CWD },
  args: {
    options: {
      rootPackage: {
        short: 'p',
        description: `Path to monorepo root package file (defaults to ${cli.colors.url(
          packagePath
        )})`,
        default: packagePath
      },
      homepagePrefix: {
        short: 'x',
        description: `Prefix relative path URLs (default ${cli.colors.value(
          'tree/main'
        )} as for GitHub)`,
        default: 'tree/main'
      }
    },
    flags: {
      write: {
        short: 'w',
        description: 'Write changes to workspace package files (default false)',
        default: false
      },
      repository: {
        description: 'Update package.repo.directory (default true)',
        default: true
      },
      homepage: {
        description: 'Update package.homepage (default true)',
        default: true
      }
    }
  }
});

const {
  values: {
    rootPackage: pathToRootPackage,
    repository,
    homepage,
    homepagePrefix,
    write
  }
} = args;
const spinner = cli.spinner();

packagePath = path.resolve(CWD, pathToRootPackage);
spinner.start(`Loading ${cli.colors.url(packagePath)}`);
const rootPackage = await pkg.importLocal(packagePath);
spinner.succeed(`Root package ${cli.colors.url(packagePath)}`);

let rootPath = packagePath;
if (!fs.lstatSync(packagePath).isDirectory()) {
  rootPath = path.dirname(packagePath);
}

let workspaces: string[] = [];

if (rootPackage.workspaces && rootPackage.workspaces.length > 0) {
  workspaces.push(...rootPackage.workspaces);
  spinner.succeed(
    `Workspaces defined in root ${cli.colors.value('package.json')}`
  );
} else {
  spinner.fail(
    `No workspaces defined in root ${cli.colors.value('package.json')}`
  );
}

const pnpmWorkspace = path.resolve(rootPath, 'pnpm-workspace.yaml');
spinner.start(`Searching for ${cli.colors.url(pnpmWorkspace)}`);
if (fs.existsSync(pnpmWorkspace)) {
  workspaces.push(
    ...(YAML.parse(fs.readFileSync(pnpmWorkspace).toString()).packages || [])
  );
  spinner.succeed(`PNPM workspace ${cli.colors.url(pnpmWorkspace)}`);
} else {
  spinner.fail(`No PNPM workspace definition`);
}

if (workspaces.length === 0) {
  spinner.fail(`No workspace definitions found`);
  process.exit(0);
}

const rootHomepage =
  homepage && rootPackage.homepage ? new URL(rootPackage.homepage) : undefined;

const rootRepository =
  repository && rootPackage.repository
    ? {
        url:
          typeof rootPackage.repository == 'string'
            ? rootPackage.repository
            : rootPackage.repository.url,
        type:
          typeof rootPackage.repository == 'string'
            ? await cli.prompts.input({
                message: 'What type of repository is being used?',
                default: 'git',
                validate: cli.validators.notEmpty
              })
            : rootPackage.repository.type
      }
    : undefined;

for (const workspace of workspaces) {
  const pathToWorkspace = path.join(rootPath, workspace);
  for (const packagePath of await glob(pathToWorkspace)) {
    const workspaceRelativePath = packagePath.replace(
      new RegExp(`^${rootPath}/`),
      ''
    );
    spinner.start(cli.colors.url(workspaceRelativePath));
    const workspacePackagePath = path.join(packagePath, 'package.json');
    const workspacePackage = await pkg.importLocal(workspacePackagePath);

    let workspaceHomepage: string | URL | undefined = workspacePackage.homepage;
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
      if (workspaceHomepage) {
        updatedPackage.homepage = workspaceHomepage.toString();
      }
      if (workspaceRepository) {
        updatedPackage.repository = workspaceRepository;
      }
      fs.writeFileSync(
        workspacePackagePath,
        JSON.stringify(updatedPackage, null, 2)
      );
      spinner.succeed(`Updated ${cli.colors.url(workspaceRelativePath)}`);
    } else {
      const summary: Record<string, any> = { name: workspacePackage.name };
      if (workspaceHomepage) {
        summary['homepage'] = workspaceHomepage.toString();
      }
      if (workspaceRepository) {
        summary['repository'] = workspaceRepository;
      }
      spinner.succeed(`Computed ${cli.colors.url(workspaceRelativePath)}`);
      cli.log.info(cli.colors.value(JSON.stringify(summary, null, 2)));
    }
  }
}
