import { IPackageJson } from 'package-json-type';

export default function cleanEmptyDependencies(projectPackage: IPackageJson) {
  for (const dependency of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'peerDependenciesMeta'
  ]) {
    if (
      projectPackage[dependency] &&
      Object.keys(projectPackage[dependency]).length == 0
    ) {
      delete projectPackage[dependency];
    }
  }
}
