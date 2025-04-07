import { Core } from '@battis/qui-cli.core';
import { register } from '@battis/qui-cli.plugin';
import * as MonorepoPackagePaths from './MonorepoPackagePaths.js';

await register(MonorepoPackagePaths);
await Core.run();
