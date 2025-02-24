#!/usr/bin/env node

import pkg from '@battis/import-package-json';
import { Colors } from '@battis/qui-cli.colors';
import { Core } from '@battis/qui-cli.core';
import { Log } from '@battis/qui-cli.log';
import { Root } from '@battis/qui-cli.root';
import fs from 'fs';
import ora from 'ora';
import { IDependencyMap, IPackageJson } from 'package-json-type';
import path from 'path';
import cleanEmptyDependencies from './cleanEmptyDependencies.js';

const cacheFilename = 'add-peer-depencies.cache.json';
const peers: Record<string, IDependencyMap> = {
  dependencies: {},
  devDependencies: {},
  peerDependencies: {}
};
const peersMeta: Record<string, { peerOf: IDependencyMap }> = {};
const examined: IDependencyMap = {};

Root.configure({ root: process.cwd() });
const args = await Core.init({
  opt: {
    package: {
      short: 'p',
      description: `Path to package.json to examine (defaults to package in current working directory: ${Colors.url(
        path.resolve(Root.path(), 'package.json')
      )})`,
      default: './package.json'
    }
  },
  flag: {
    remove: {
      short: 'r',
      description: `Removes dependencies added by this tool`
    },
    write: {
      short: 'w',
      description: `Write changes to package.json (required to make changes, omitting ${Colors.command(
        '--write'
      )} is a dry run that outputs results to the console)`
    },
    optional: {
      short: 'o',
      description: 'Include optional peer dependencies (defaults to false)'
    },
    dev: {
      short: 'd',
      description: `Install missing peers as ${Colors.value(
        'devDependencies'
      )} (defaults to true, ${Colors.command(
        '--no-dev'
      )} to install as regular ${Colors.value('dependencies')})`,
      default: true
    },
    metadata: {
      short: 'm',
      description:
        'Update package metadata to indicate which peers have been installed by this tool (defaults to false)',
      default: false
    },
    cache: {
      short: 'c',
      description: `Update ${Colors.url(
        cacheFilename
      )} in the package root to indicate which peers have been installed by this tool (defaults to true, ${Colors.command(
        '--no-cache'
      )} to omit)`,
      default: true
    }
  }
});
const { remove, write, optional, dev, metadata, cache } = args.values;
let { package: packagePath } = args.values;

// TODO waiting on better typing in @battis/qui-cli
if (!packagePath) {
  throw new Error(`option ${Colors.value('--package')} must be defined`);
}

const spinner = ora();
let projectPackage: IPackageJson;
try {
  packagePath = path.resolve(Root.path(), packagePath);
  spinner.start(`Loading ${Colors.url(packagePath)}`);
  projectPackage = await pkg.importLocal(packagePath);
  spinner.succeed(`Loaded ${Colors.url(packagePath)}`);
} catch (error) {
  spinner.fail(`Failed to load ${Colors.url(packagePath)}`);
  throw error;
}

async function addToPeers({
  peerName,
  peerVersion = '*',
  dependency,
  packageName,
  packageVersion = '*'
}: {
  peerName: string;
  peerVersion?: string;
  dependency: string;
  packageName: string;
  packageVersion?: string;
}) {
  Log.info(
    `${Colors.value(
      `${peerName}@${peerVersion}`
    )} is peer of ${Colors.value(`${packageName}@${packageVersion}`)}`
  );
  if (
    peerName in peers[dependency] &&
    !new RegExp(`(^| )${peerVersion}( |$)`).test(peerVersion)
  ) {
    peers[dependency][peerName] += ` ${peerVersion}`;
  } else {
    peers[dependency][peerName] = peerVersion;
    const peerPackage = await pkg.importLocalWithNPMFallback(
      peerName,
      peerVersion
    );
    if (peerPackage) {
      await identifyPeers({ targetPackage: peerPackage });
    }
  }
  if (!peersMeta[peerName]) {
    peersMeta[peerName] = {
      peerOf: { [packageName]: packageVersion }
    };
  } else {
    peersMeta[peerName].peerOf[packageName] = packageVersion;
  }
}

async function identifyPeers({
  targetPackage,
  includeDev = false
}: {
  targetPackage: IPackageJson;
  includeDev?: boolean;
}) {
  if (
    targetPackage.name &&
    (!examined[targetPackage.name] ||
      !examined[targetPackage.name].includes(targetPackage.version || '*'))
  ) {
    if (examined[targetPackage.name]) {
      examined[targetPackage.name] += ` ${targetPackage.version}`;
    } else {
      examined[targetPackage.name] = targetPackage.version || '*';
    }
    for (const dependency in peers) {
      if (dependency != 'devDependencies' || includeDev) {
        for (const packageName in targetPackage[dependency]) {
          const packageVersion = targetPackage[dependency][packageName];
          if (dependency == 'peerDependencies') {
          }
          const dependencyPackage = await pkg.importLocalWithNPMFallback(
            packageName,
            targetPackage[dependency][packageName]
          );
          if (dependencyPackage) {
            for (const peerName in dependencyPackage.peerDependencies) {
              if (
                optional ||
                !dependencyPackage.peerDependenciesMeta ||
                !dependencyPackage.peerDependenciesMeta[peerName] ||
                dependencyPackage.peerDependenciesMeta[peerName]?.optional !=
                  true
              ) {
                await addToPeers({
                  peerName,
                  peerVersion: dependencyPackage.peerDependencies[peerName],
                  dependency,
                  packageName,
                  packageVersion: targetPackage[dependency][packageName]
                });
              }
            }
            if (dependency == 'peerDependencies') {
              if (
                optional ||
                !targetPackage.peerDependenciesMeta ||
                !targetPackage.peerDependenciesMeta[packageName] ||
                targetPackage.peerDependenciesMeta[packageName]?.optional !=
                  true
              ) {
                await addToPeers({
                  peerName: packageName,
                  peerVersion: packageVersion,
                  dependency,
                  packageName: targetPackage.name,
                  packageVersion: targetPackage.version
                });
              }
            } else {
              await identifyPeers({ targetPackage: dependencyPackage });
            }
          } else {
            spinner.fail(
              `${packageName}@${packageVersion} could not be satisfied (peer of ${targetPackage.name}@${targetPackage.version}`
            );
          }
        }
      }
    }
  }
}

const cachePath = path.join(
  path.basename(packagePath) == 'package.json'
    ? path.dirname(packagePath)
    : packagePath,
  cacheFilename
);
spinner.start('Identifying cache information');
let cacheHistory: Record<string, any>;
if (fs.existsSync(cachePath)) {
  cacheHistory = JSON.parse(fs.readFileSync(cachePath).toString());
  spinner.succeed(`Loaded ${Colors.url(cachePath)}`);
} else {
  cacheHistory = projectPackage.peerDependencieMeta;
  if (cache) {
    spinner.succeed(
      `Cache loaded from ${Colors.url(packagePath)}.${Colors.value(
        'peerDependenciesMeta'
      )}`
    );
  }
}

if (remove) {
  if (!cacheHistory) {
    spinner.fail(`Cache data could not be found`);
    process.exit(1);
  }
  for (const peerName of Object.keys(cacheHistory)) {
    if (cacheHistory[peerName].peerOf) {
      for (const dependency of ['devDependencies', 'dependencies'])
        if (
          projectPackage[dependency] &&
          projectPackage[dependency][peerName]
        ) {
          Log.info(
            `${Colors.value(
              `${peerName}@${projectPackage[dependency][peerName]}`
            )} removed from ${Colors.value(dependency)}`
          );
          delete projectPackage[dependency][peerName];
        }
      delete cacheHistory[peerName];
    }
  }
} else {
  await identifyPeers({ targetPackage: projectPackage, includeDev: true });
  spinner.succeed('Peer dependencies inspected');

  projectPackage = {
    ...projectPackage,
    dependencies: {
      ...projectPackage.dependencies,
      ...(dev
        ? {}
        : Object.keys(peers).reduce(
            (dependencies, typeOfDependency) => ({
              ...dependencies,
              ...peers[typeOfDependency]
            }),
            {}
          ))
    },
    devDependencies: {
      ...projectPackage.devDependencies,
      ...(dev
        ? Object.keys(peers).reduce(
            (dependencies, typeOfDependency) => ({
              ...dependencies,
              ...peers[typeOfDependency]
            }),
            {}
          )
        : {})
    }
  };
}

cacheHistory = {
  ...cacheHistory,
  ...Object.keys(peersMeta).reduce((built: Record<string, any>, peer) => {
    if (
      !projectPackage.peerDependenciesMeta ||
      !(peer in projectPackage.peerDependenciesMeta)
    ) {
      built[peer] = peersMeta[peer];
    }
    return built;
  }, {})
};
if (cache) {
  if (write) {
    spinner.start(`Updating ${Colors.url(cachePath)}`);
    fs.writeFileSync(cachePath, JSON.stringify(cacheHistory));
    spinner.succeed(`Wrote cache to ${Colors.url(cachePath)}`);
  } else {
    spinner.succeed(
      `Computed ${Colors.url(cachePath)}\n${JSON.stringify(
        cacheHistory,
        null,
        2
      )}`
    );
  }
}

if (metadata) {
  spinner.start(`Adding cache data to ${Colors.value('peerDependenciesMeta')}`);
  projectPackage.peerDependenciesMeta = {
    ...projectPackage.peerDependenciesMeta,
    ...cacheHistory
  };
  spinner.succeed(
    `Cache data added to ${Colors.value('peerDependenciesMeta')}`
  );
}

cleanEmptyDependencies(projectPackage);
const packageContents = JSON.stringify(projectPackage, null, 2);
if (write) {
  spinner.start(`Updating ${Colors.url(packagePath)}`);
  fs.writeFileSync(packagePath, packageContents);
  spinner.succeed(`${Colors.url(packagePath)} written`);
} else {
  spinner.succeed(`Computed ${Colors.url(packagePath)}\n${packageContents}`);
}
