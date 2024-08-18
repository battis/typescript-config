import path from 'path'
import { IPackageJson } from 'package-json-type';

export default async function importLocal(packageName: string) {
  return (await import(
      path.join(
          packageName,
          path.basename(packageName) != 'package.json' ? 'package.json' :''
      ),
      { assert: { type: 'json' }}
  )).default as IPackageJson;
}
