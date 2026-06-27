import { Core } from '@qui-cli/core';
import { register } from '@qui-cli/plugin';
import * as MonorepoPackagePaths from './MonorepoPackagePaths.js';

await register(MonorepoPackagePaths);
await Core.run();
