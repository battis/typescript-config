import path from 'path';
export default async function importPackage(packageName) {
    return (await import(path.join(packageName, path.basename(packageName) != 'package.json' ? 'package.json' : ''), { assert: { type: 'json' } })).default;
}
