import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

type Options = {
  // script config
  root: string;
  template?: string;
  bundle?: string;
  production?: boolean;
  override?: Record<keyof typeof Options.resolve, boolean>;

  // webpack config
  entry?: string;
  output?: {
    path?: string;
    filename?: string;
  };
  resolve?: {
    extensions: string[];
  };
  module?: {
    rules: webpack.RuleSetRule[];
  };
  externals?: webpack.Configuration['externals'];
  plugins?: webpack.WebpackPluginInstance[];
  optimization?: webpack.Configuration['optimization'];

  terserOptions?: ConstructorParameters<typeof TerserPlugin>[0];
};

namespace Options {
  export function mode(production: boolean) {
    return production ? 'production' : 'development';
  }

  export namespace resolve {
    function resolveObject<T>(base: T, override = false, arg?: T) {
      return override ? arg : { ...base, ...arg };
    }

    function resolveArray<T>(base: T[], override = false, arg: T[] = []) {
      return override ? arg : [...base!, ...arg!];
    }

    export const resolveExtensions = resolveArray<string>;
    export const externals = resolveObject;
    export const plugins = resolveArray<webpack.WebpackPluginInstance>;
    export const moduleRules = resolveArray<webpack.RuleSetRule>;
    export const optimization = resolveObject; //<webpack.Optimization> not exported, webpack.Configuration['optimization'] fails b/c Optimization not exported
  }
}

export default Options;
