// import { randomUUID } from "crypto";
import { Scrypt, generateIdFromEntropySize } from 'lucia';
import { alphabet, generateRandomString } from 'oslo/crypto';

export function getHash(value: string) {
  return new Scrypt().hash(value);
}

export function isHashValid(hash: string, value: string) {
  return new Scrypt().verify(hash, value);
}

export function generateCode() {
  return generateRandomString(6, alphabet('0-9'));
}

export function generateId(prefix = '') {
  /**
   * Generates a random [RFC 4122](https://www.rfc-editor.org/rfc/rfc4122.txt) version 4 UUID. The UUID is generated using a
   * cryptographic pseudorandom number generator.
   * @example "36b8f84d-df4e-4d49-b662-bcde71a8764f"
   * @since v15.6.0, v14.17.0
   */
  // return randomUUID();
  /**
   *  Generates a cryptographically strong random string made of a-z (lowercase) and 2-7 using the provided entropy size.
   * The output length increases as the entropy size increases.
   * If size is a multiple of 5, the output size will be (size * 8) / 5 (see base32 encoding).
   * @example "62zhs6gceakgksk3k5igjpumudeo4sxiehfwx6tu"
   */
  return `${prefix}_${generateIdFromEntropySize(20).slice(prefix.length)}`;
}
