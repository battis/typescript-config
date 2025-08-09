export function esmResolver(module: string) {
  return import.meta.resolve(module).replace(/^file:\/\//, '');
}
