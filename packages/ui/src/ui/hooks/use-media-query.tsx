'use client';

import React, { useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [value, setValue] = React.useState(query.includes('min-width'));

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener('change', onChange);
    setValue(result.matches);

    return () => result.removeEventListener('change', onChange);
  }, [query]);

  return value;
}
