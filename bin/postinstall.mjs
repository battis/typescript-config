#!/usr/bin/env node
import { hoist } from '@pnpm/hoist';
import fs from 'fs';

if (fs.existsSync('../pnpm-lock.yaml')) {
  hoist({
    lockfile: '../pnpm-lock.yaml',
    publicHoistPattern: ['*prettier*']
  });
}
