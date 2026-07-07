import { Init, Placeholders } from '@qui-cli/init';
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
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    if (pkg.name) {
      Placeholders.configure({
        placeholders: {
          path: [
            path
              .relative(path.join(appRootPath.toString()), process.cwd())
              .replace(/^[^/]+\//, '')
          ],
          scope: [path.basename(process.cwd())],
          name: [pkg.name]
        }
      });
      if (fs.existsSync(srcPath)) {
        const src = Placeholders.replaceAll(fs.readFileSync(srcPath, 'utf8'));

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
  } else {
    return (
      `${Colors.path(
        destPath,
        Colors.keyword
      )} could not be verified because no ${Colors.path('package.json')} ` +
      `file is present in ${Colors.path(process.cwd())}`
    );
  }
};

Init.configure({
  enclosingDirectory: false,
  template: path.resolve(import.meta.dirname, '../template'),
  fileHandlers: { '.versionrc.json': versionrc }
});
Positionals.requireAtLeast(0);
await Core.run();
