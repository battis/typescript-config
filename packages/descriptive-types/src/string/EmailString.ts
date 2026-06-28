import email from 'email-validator';

/** A string that is an email address */
export type EmailString = string;

export function isEmailString(value: unknown): value is EmailString {
  return !!value && typeof value === 'string' && email.validate(value);
}
