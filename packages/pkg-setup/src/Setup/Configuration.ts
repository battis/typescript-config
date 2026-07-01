import { PathString } from '@battis/descriptive-types';
import * as Plugin from '@qui-cli/plugin';

export type FileHandler = (
  srcPath: PathString,
  destPath: PathString,
  config: Configuration
) => (undefined | string) | Promise<undefined | string>;

export type Configuration = Plugin.Configuration & {
  packageName?: string;
  setupDir?: PathString;
  fileHandlers?: Record<string, FileHandler>;
  force?: boolean;
};
