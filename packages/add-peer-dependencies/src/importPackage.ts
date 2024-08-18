import path from 'path'

export default async function importPackage(packageName: string) {
  return (await import(path.join(packageName, path.basename(packageName) != 'package.json' ? 'package.json' :''), { assert: { type: 'json' }})).default;
}
