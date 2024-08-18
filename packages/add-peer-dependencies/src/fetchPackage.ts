import fetch from 'node-fetch';
import { IPackageJson } from 'package-json-type';
import semver from 'semver';

type PackageDescription = {
  _id: IPackageJson['name'];
  _ref: string;
  name: IPackageJson['name'];
  'dist-tags': { latest: string } & Record<string, string>;
  versions: Record<NonNullable<IPackageJson['version']>, IPackageJson>;
  time: { created: string; modified: string } & Record<
    NonNullable<IPackageJson['version']>,
    string
  >;
  bugs?: IPackageJson['bugs'];
  author?: IPackageJson['author'];
  license?: IPackageJson['license'];
  homepage?: IPackageJson['homepage'];
  description?: IPackageJson['description'];
  maintainers?: { name: string; email: string }[];
  readme?: string;
  readmeFilename?: string;
};

export default async function fetchPackage(name: string, version: string) {
  const description = (await (
    await fetch(`https://registry.npmjs.com/${name}`)
  ).json()) as PackageDescription;
  return Object.values(description.versions).reduce(
    (result: IPackageJson | undefined, curr) =>
      semver.satisfies(curr.version!, version) ? curr : result,
    undefined
  );
}
