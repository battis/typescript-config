/**
 * Typing for Sass modules to use ICSS `:export` to share variables with
 * TypeScript
 */
declare module '*.scss' {
  const content: { [key: string]: string };
  export default content;
}
