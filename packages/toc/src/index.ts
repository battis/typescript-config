import { Core } from '@qui-cli/core';
import { register } from '@qui-cli/plugin';
import * as TOC from './TOC.js';

await register(TOC);
await Core.run();
