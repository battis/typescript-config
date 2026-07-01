import { Core } from '@qui-cli/core';
import * as Monorepo from './Monorepo.js';
import { register } from '@qui-cli/plugin';

await register(Monorepo);
await Core.run();
