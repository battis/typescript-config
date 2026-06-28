export * from './BooleanString.js';
export * from './DateTimeString.js';
export * from './EmailString.js';
export * from './JSONString.js';
export * from './NumericString.js';
export * from './PathString.js';
export * from './TimeZoneString.js';
export * from './URLString.js';

/** A string that is a UUID */
export type UUIDString = string;

/** A string that contains HTML formatting tags */
export type HTMLString = string;

/** A string that represents a MIME type */
export type MimeTypeString = string;

/**
 * A string that represents a color definition, with an Format type of 'Hex',
 * 'HSL', etc.
 */
export type ColorString<_Format extends string> = string;

/** A string that is a list of data of ItemType separated by Delimiter */
export type ListOf<
  _ItemType extends string,
  _Delimiter extends string = ','
> = string;
