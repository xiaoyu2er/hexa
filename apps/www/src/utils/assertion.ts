export type Dict<T = unknown> = Record<string, T>;

export function isArray<T>(value: unknown): value is T[] {
  return Array.isArray(value);
}

export function isEmptyArray(value: unknown): boolean {
  return isArray(value) && value.length === 0;
}

export function isObject(value: unknown): value is Dict {
  const type = typeof value;

  return (
    value != null &&
    (type === 'object' || type === 'function') &&
    !isArray(value)
  );
}

export function isEmptyObject(value: unknown): boolean {
  return isObject(value) && Object.keys(value).length === 0;
}

// Empty assertions
export function isEmpty(value: unknown): boolean {
  if (isArray(value)) {
    return isEmptyArray(value);
  }
  if (isObject(value)) {
    return isEmptyObject(value);
  }
  if (value == null || value === '') {
    return true;
  }

  return false;
}

// Function assertions
export function isFunction(
  value: unknown
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

type Booleanish = boolean | 'true' | 'false';
export const dataAttr = (condition: boolean | undefined) =>
  (condition ? 'true' : undefined) as Booleanish;

export const isNumeric = (value?: string | number) =>
  value != null && Number.parseInt(value.toString(), 10) > 0;
