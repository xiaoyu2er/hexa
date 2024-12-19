type IconComponent = (props: { className?: string }) => unknown;

export type SelectOption<T extends string | number = string> = {
  label: string;
  value: T;
  icon?: IconComponent;
};

export type SelectOptionGroup<T extends string | number = string> = {
  label: string;
  options: SelectOption<T>[];
};

export type SelectOptions<T extends string | number = string> = (
  | SelectOption<T>
  | SelectOptionGroup<T>
)[];

// Type guard to check if an option is a group
export function isSelectOptionGroup<T extends string | number>(
  option: SelectOption<T> | SelectOptionGroup<T>
): option is SelectOptionGroup<T> {
  return 'options' in option;
}

// Helper type to extract all values from SelectOptions including groups
export type ExtractSelectOptionValues<T> = T extends SelectOptions<infer V>
  ? V
  : never;

// Helper type to extract all options from SelectOptions including groups
export type FlattenSelectOptions<T extends SelectOptions> =
  T extends (infer U)[]
    ? U extends SelectOptionGroup
      ? U['options'][number]
      : U extends SelectOption
        ? U
        : never
    : never;
