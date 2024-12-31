import PackageJson from '@npmcli/package-json';
import fs from 'fs';
import { jack } from 'jackspeak';
import ora from 'ora';
import shell from 'shelljs';
import winston from 'winston';

const PNPM_LOCKFILE = 'pnpm-lock.yaml';
const NPMRC = '.npmrc';

(async () => {
  const parser = jack()
    .opt({
      source: {
        short: 's',
        description: 'Source directory (relatie to project root)',
        default: 'src'
      },
      target: {
        short: 'T',
        description:
          'Transpilation target directory (relative to project root)',
        default: 'dist'
      },
      extensions: {
        short: 'x',
        description: 'Source file extensions to process',
        default: '.ts,.tsx'
      },
      'cjs-dir': {
        short: 'c',
        description: 'CommonJS target subdirectory',
        default: 'cjs'
      },
      'esm-dir': {
        short: 'e',
        description: 'ES module target subdirectory',
        default: 'esm'
      },
      'types-dir': {
        short: 't',
        description: 'Typescript types target subdirectory',
        default: 'types'
      }
    })
    .flag({
      help: {
        short: 'h',
        description: 'Usage'
      },
      pnpm: {
        short: 'p',
        description:
          'Update .npmrc and rebuild modules with pnpm afterwards (done by default if pnpm-lock.yaml existsm unless --no-pnpm flag is passed)'
      },
      'source-maps': {
        description: 'Include source maps'
      },
      'no-cjs': {
        description: 'Do not transpile CommonJS module'
      },
      'no-esm': {
        description: 'Do not transpile ES module'
      },
      'no-types': {
        description: 'Do not export Typescript types'
      },
      'no-reset-type': {
        description: 'Do not reset module type'
      },
      'no-exports': {
        description: 'Do not configure conditional exports'
      },
      'no-scripts': {
        description: 'Do not rewrite build scripts'
      },
      'no-tsconfig': {
        description: 'Do not overwrite tsconfig.json'
      },
      'no-log': {
        description: 'Disable logging'
      }
    });
  const args = parser.parse();

  if (args.values.help) {
    console.log(parser.usage());
    process.exit(0);
  }

  const logger = winston.createLogger({
    transports: [new winston.transports.Console({ level: 'error' })]
  });
  if (!args.values['no-log']) {
    logger.configure({
      transports: [
        new winston.transports.File({
          filename: `${new Date().toISOString()} babel-config.log`,
          level: 'silly'
        })
      ]
    });
  }
  const pkgJson = await PackageJson.load(process.cwd());

  let moduleType = pkgJson.content.type;
  if (!args.values['no-reset-type']) {
    const spinner = ora('Resetting package.json type').start();
    logger.info(`original package.content.type: ${moduleType}`);
    moduleType = undefined;
    logger.info(`updated packaage.content.type: ${moduleType}`);
    spinner.succeed('Reset package.json type');
  }

  const exports = pkgJson.content.exports || {};
  if (!args.values['no-exports']) {
    const spinner = ora('Updating package.json exports...').start();
    logger.info(`original package.content.exports: ${exports}`);
    exports['.'] = {};
    if (!args.values['no-types']) {
      exports['.'].types =
        `./${args.values.target}/${args.values['types-dir']}`;
    }
    if (!args.values['no-cjs']) {
      exports['.'].require =
        `./${args.values.target}/${args.values['cjs-dir']}`;
    }
    if (!args.values['no-esm']) {
      exports['.'].import = `./${args.values.target}/${args.values['esm-dir']}`;
      exports['.'].default = exports['.'].import;
    } else if (!args.values['no-cjs']) {
      exports['.'].default = exports['.'].require;
    }
    logger.info(`updated package.content.exports: ${exports}`);
    spinner.succeed('package.json exports updated');
  }

  let scripts = pkgJson.content.scripts;
  if (!args.values['no-scripts']) {
    const spinner = ora('updating package.json scripts').start();
    logger.info(`original package.contents.scripts: ${scripts}`);
    for (const key in scripts) {
      if (/^build/.test(key)) {
        delete scripts[key];
      }
    }
    scripts.build = 'run-s build:*';
    scripts['build:clean'] = `del ${args.values.target}`;
    if (!args.values['no-cjs']) {
      scripts['build:cjs'] = `babel "${args.values.source}" --extensions "${
        args.values.extensions
      }" --out-dir "${args.values.target}/${args.values['cjs-dir']}" ${
        args.values['source-maps'] ? '--source-maps ' : ''
      }--config-file @battis/babel-config/cjs.json`;
    }
    if (!args.values['no-esm']) {
      scripts['build:esm'] = `babel "${args.values.source}" --extensions "${
        args.values.extensions
      }" --out-dir "${args.values.target}/${
        args.values['esm-dir']
      }" --out-file-extension .mjs ${
        args.values['source-maps'] ? '--source-maps ' : ''
      }--config-file @battis/babel-config/esm.json`;
    }
    if (!args.values['no-types']) {
      scripts['build:types'] = 'tsc';
    }
    logger.info(`updated package.contents.scripts: ${scripts}`);
    spinner.succeed('package.json build scripts updated');
  }

  pkgJson.update({
    exports,
    type: moduleType,
    scripts
  });
  await pkgJson.save();

  if (!args.values['no-tsconfig']) {
    const spinner = ora('Creating tsconfig.json').start();
    fs.writeFileSync(
      'tsconfig.json',
      JSON.stringify({
        extends: '@battis/babel-config/tsconfig.json',
        compilerOptions: {
          outDir: `${args.values.target}/${args.values['types-dir']}`
        },
        include: [args.values.source]
      })
    );
    logger.info('wrote tsconfig.json');
    spinner.succeed('tsconfig.json created');
  }

  if (
    args.values.pnpm ||
    (fs.existsSync(PNPM_LOCKFILE) && !args.values['no-pnpm'])
  ) {
    const spinner = ora('updating .npmrc to hoist dependencies');
    let npmrc = [];
    if (fs.existsSync(NPMRC)) {
      npmrc = fs
        .readFileSync(NPMRC)
        .toString()
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    }
    logger.info(`original .npmrc: ${npmrc.join('\n')}`);
    npmrc.push(
      'public-hoist-pattern[]=*babel*',
      'public-hoist-pattern[]=typescript'
    );
    npmrc = [...new Set(npmrc)];
    fs.writeFileSync(NPMRC, npmrc.join('\n'));
    shell.exec('pnpm rebuild');
    logger.info(`updated .npmrc: ${npmrc.join('\n')}`);
    spinner.succeed('.npmrc hoist patterns updated');
  }
})();
