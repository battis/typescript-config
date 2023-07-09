#!/usr/bin/env node
import { hoist } from '@pnpm/hoist';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lockfile = path.join(
  import.meta.url.replace(/(^.*)\/node_modules.*/, '$1'),
  'pnpm-lock.yaml'
);

if (fs.existsSync(lockfile)) {
  console.log('pnpm lockfile found');
  const pkg = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../package.json'))
  );
  const publicHoistPattern = Object.keys(pkg.dependencies);
  if (publicHoistPattern.length) {
    console.log(`hoisting ${publicHoistPattern.join(', ')}`);
    hoist({
      lockfile,
      publicHoistPattern
    });
  }
}
