import PackageJson from '@npmcli/package-json';
import fs from 'fs';
import { jack } from 'jackspeak';

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
      }
    });
  const args = parser.parse();

  if (args.values.help) {
    console.log(parser.usage());
    process.exit(0);
  }

  const pkgJson = await PackageJson.load(process.cwd());

  const moduleType = args.values['no-reset-type']
    ? pkgJson.content.type
    : undefined;

  const exports = pkgJson.content.exports || {};
  if (!args.values['no-exports']) {
    exports['.'] = {};
    if (!args.values['no-types']) {
      exports[
        '.'
      ].types = `./${args.values.target}/${args.values['types-dir']}`;
    }
    if (!args.values['no-cjs']) {
      exports[
        '.'
      ].require = `./${args.values.target}/${args.values['cjs-dir']}`;
    }
    if (!args.values['no-esm']) {
      exports['.'].import = `./${args.values.target}/${args.values['esm-dir']}`;
      exports['.'].default = exports['.'].import;
    } else if (!args.values['no-cjs']) {
      exports['.'].default = exports['.'].require;
    }
  }

  let scripts = pkgJson.content.scripts;
  if (!args.values['no-scripts']) {
    for (const key in scripts) {
      if (/^build/.test(key)) {
        delete scripts[key];
      }
    }
    scripts.build = 'run-s build:*';
    scripts['build:clean'] = `shx rm -rf ${args.values.target}`;
    if (!args.values['no-cjs']) {
      scripts['build:cjs'] = `babel "${args.values.source}" --extensions "${args.values.extensions
        }" --out-dir "${args.values.target}/${args.values['cjs-dir']}" ${args.values['source-maps'] ? '--source-maps ' : ''
        }--config-file @battis/babel-config/cjs.json`;
    }
    if (!args.values['no-esm']) {
      scripts['build:esm'] = `babel "${args.values.source}" --extensions "${args.values.extensions
        }" --out-dir "${args.values.target}/${args.values['esm-dir']
        }" --out-file-extension .mjs ${args.values['source-maps'] ? '--source-maps ' : ''
        }--config-file @battis/babel-config/esm.json`;
    }
    if (!args.values['no-types']) {
      scripts['build:types'] = 'tsc';
    }
  }

  pkgJson.update({
    exports,
    type: moduleType,
    scripts
  });
  await pkgJson.save();

  if (!args.values['no-tsconfig']) {
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
  }
})();
