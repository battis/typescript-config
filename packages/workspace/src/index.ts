import { Setup } from '@battis/pkg-setup';
import { Core } from '@qui-cli/core';
import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import appRootPath from 'app-root-path';

const versionrc: Setup.FileHandler = async ({
  srcPath,
  destPath,
  config,
  pkg
}) => {
  if (pkg.name) {
    if (fs.existsSync(srcPath)) {
      const src = fs
        .readFileSync(srcPath, 'utf8')
        .replaceAll(
          '{{PATH}}',
          path
            .relative(path.join(appRootPath.toString()), process.cwd())
            .replace(/^[^/]+\//, '')
        )
        .replaceAll('{{SCOPE}}', path.basename(process.cwd()))
        .replaceAll('{{NAME}}', pkg.name);

      await Setup.confirm.withDiff(
        src,
        fs.existsSync(destPath) ? fs.readFileSync(destPath, 'utf8') : undefined,
        Colors.path(destPath, Colors.keyword),
        () => fs.writeFileSync(destPath, src),
        config
      );
    } else {
      Log.error(
        Colors.error(
          `Could not read from ${Colors.path(srcPath, Colors.keyword)}`
        )
      );
    }
  } else {
    return `${Colors.path(
      destPath,
      Colors.keyword
    )} could not be verified because ${Colors.path(
      path.join(process.cwd(), 'package.json'),
      Colors.keyword
    )} has no ${Colors.value('name')} defined.`;
  }
};

Setup.configure({
  packageName: '@battis/workspace',
  fileHandlers: { '.versionrc.json': versionrc }
});
await Core.run();
