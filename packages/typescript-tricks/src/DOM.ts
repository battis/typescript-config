// https://stackoverflow.com/a/70995964/294171
export type HTMLFormElements<U extends string> = HTMLFormControlsCollection &
  Record<U, HTMLInputElement>;
