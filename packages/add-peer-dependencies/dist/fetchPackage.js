import fetch from 'node-fetch';
import semver from 'semver';
export default async function fetchPackage(name, version) {
    const description = (await (await fetch(`https://registry.npmjs.com/${name}`)).json());
    return Object.values(description.versions).reduce((result, curr) => semver.satisfies(curr.version, version) ? curr : result, undefined);
}
