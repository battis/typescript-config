import { IPackageJson } from 'package-json-type';
import path from 'path';

export default async function importLocal(packageName: string) {
  return (
    await import(
      path.join(
        packageName,
        path.basename(packageName) != 'package.json' ? 'package.json' : ''
      ),
      { assert: { type: 'json' }, with: { type: 'json' } }
    )
  ).default as IPackageJson;
}
