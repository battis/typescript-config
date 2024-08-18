import { IPackageJson } from 'package-json-type';
export default function fetchPackage(name: string, version: string): Promise<IPackageJson | undefined>;
