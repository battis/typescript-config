/**
 * Expose the current webpack hash for use in TypeScript
 */
declare const __webpack_hash__: string;

/**
 * Typing for Sass modules to use ICSS `:export` to share variables with
 * TypeScript
 */
declare module '*.module.scss' {
  const content: { [key: string]: string };
  export default content;
}

/**
 * Typing for including images as "asset/resource"
 */
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.png';
