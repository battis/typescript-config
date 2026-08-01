import { DateTimeString } from '@battis/descriptive-types';
import fetch from 'node-fetch';
import { IPackageJson } from 'package-json-type';
import semver from 'semver';

type Version = string;
type Tag = string;

type PackageDescription = Pick<
  IPackageJson,
  | 'name'
  | 'bugs'
  | 'author'
  | 'contributers'
  | 'maintainers'
  | 'license'
  | 'homepage'
  | 'description'
  | 'keywords'
> & {
  _id: IPackageJson['name'];
  _rev: string;
  'dist-tags': { latest: Version } & Record<Tag, Version>;
  versions: Record<Version, IPackageJson>;
  time: {
    created: DateTimeString<'RFC 3339'>;
    modified: DateTimeString<'RFC 3339'>;
  } & Record<Version, DateTimeString<'RFC 3339'>>;
  readme?: string;
  readmeFilename?: string;
};

export default async function fetchNPM(name: string, version: string) {
  const description = (await (
    await fetch(`https://registry.npmjs.com/${name}`)
  ).json()) as PackageDescription;
  return Object.values(description.versions).reduce(
    (result: IPackageJson | undefined, curr) =>
      semver.satisfies(curr.version!, version) ? curr : result,
    undefined
  );
}
