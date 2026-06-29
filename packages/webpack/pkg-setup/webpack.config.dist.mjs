import bundle from '@battis/webpack';

export default bundle.fromTS.toVanillaJS({
  root: import.meta.dirname
});
