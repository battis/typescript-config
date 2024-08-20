import fetchNPM from './fetchNPM.js';
import importLocal from './importLocal.js';
import semver from 'semver';

export { fetchNPM, importLocal };

export async function importLocalWithNPMFallback(
  packageName: string,
  packageVersion = '*'
) {
  try {
    const pkg = await importLocal(packageName);
    if (
      packageVersion == 'workspace:*' ||
      (pkg.version && semver.satisfies(pkg.version, packageVersion))
    ) {
      return pkg;
    } else {
      throw new Error(
        `Local package ${pkg.name}@${pkg.version} does not satisfy version range ${packageVersion}`
      );
    }
  } catch (error) {
    return await fetchNPM(packageName, packageVersion);
  }
}

export default { importLocal, fetchNPM, importLocalWithNPMFallback };
