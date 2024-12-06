import type {
  ExtractSelectOptionValues,
  SelectOption,
  SelectOptionGroup,
} from './select-option';

// Base type for checking array values
export type CheckArrayContainsAllValues<
  TRequired extends string | number,
  TValues extends string | number,
> = Exclude<TRequired, TValues> extends never
  ? true
  : Exclude<TRequired, TValues>;

// Type utility for checking objects with value property including groups
export type CheckObjectValuesContainAll<
  TRequired extends string | number,
  TOptions extends readonly (
    | SelectOption<string | number>
    | SelectOptionGroup<string | number>
  )[],
> = CheckArrayContainsAllValues<TRequired, ExtractSelectOptionValues<TOptions>>;

// Helper type to ensure type checking works at compile time
export type TypeCheck<T> = T extends true ? true : T;
