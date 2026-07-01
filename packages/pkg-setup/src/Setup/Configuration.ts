import { PathString } from '@battis/descriptive-types';
import * as Plugin from '@qui-cli/plugin';

export type Configuration = Plugin.Configuration & {
  packageName?: string;
  setupDir?: PathString;
  force?: boolean;
};
