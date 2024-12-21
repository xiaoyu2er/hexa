/**
 * Capitalizes the first letter of a string and converts the rest to lowercase
 * @param str The input string
 * @returns The formatted string with first letter capitalized and rest lowercase
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('HELLO') // 'Hello'
 * capitalize('hELLO WORLD') // 'Hello world'
 */
export const capitalize = (str: string): string => {
  if (!str) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
