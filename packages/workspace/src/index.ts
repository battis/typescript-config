import { Init } from '@qui-cli/init';
import { Core, Positionals } from '@qui-cli/core';
import fs from 'node:fs';
import path from 'node:path';
import { Colors } from '@qui-cli/colors';
import { Log } from '@qui-cli/log';
import appRootPath from 'app-root-path';

const versionrc: Init.FileHandlers.FileHandler = async ({
  srcPath,
  destPath,
  force
}) => {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );
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

      await Init.Confirm.withDiff({
        src,
        dest: fs.existsSync(destPath)
          ? fs.readFileSync(destPath, 'utf8')
          : undefined,
        identifier: Colors.path(destPath, Colors.keyword),
        action: () => fs.writeFileSync(destPath, src),
        force
      });
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

Init.configure({
  enclosingDirectory: false,
  template: path.resolve(import.meta.dirname, '../template'),
  fileHandlers: { '.versionrc.json': versionrc }
});
Positionals.requireAtLeast(0);
await Core.run();
