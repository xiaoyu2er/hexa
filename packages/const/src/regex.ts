import z from 'zod';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/RegExp#flags
export const REGEX_FLAG_CODES = [
  'd',
  'g',
  'i',
  'm',
  's',
  'u',
  'v',
  'y',
] as const;
export const zRegexFlagCode = z.enum(REGEX_FLAG_CODES);
export type RegexFlagCode = z.infer<typeof zRegexFlagCode>;

export const REGEX_FLAGS: Record<RegexFlagCode, string> = {
  d: 'd (indices)',
  g: 'g (global)',
  i: 'i (ignore case)',
  m: 'm (multiline)',
  s: 's (dotAll)',
  u: 'u (unicode)',
  v: 'v (unicodeSets)',
  y: 'y (sticky)',
};

export const REGEX_FLAGS_OPTIONS = Object.entries(REGEX_FLAGS).map(
  ([code, label]) => ({
    label,
    value: code as RegexFlagCode,
  })
);

export const zRegex = z.tuple([
  z.string(),
  z
    .string()
    .refine(
      (s) =>
        s.split('').every((c) => REGEX_FLAG_CODES.includes(c as RegexFlagCode)),
      'Invalid flags'
    ),
]);
export type Regex = z.infer<typeof zRegex>;
