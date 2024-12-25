/* eslint-disable no-undef */
import * as React from 'react';

export function useScrollSpy(
  selectors: string[],
  options?: IntersectionObserverInit
) {
  const [activeId, setActiveId] = React.useState<string | null>();
  const observer = React.useRef<IntersectionObserver>(null);

  React.useEffect(() => {
    const elements = selectors.map((selector) =>
      document.querySelector(selector)
    );

    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry?.isIntersecting) {
          setActiveId(entry.target.getAttribute('id'));
        }
      }
    }, options);
    for (const el of elements) {
      el && observer.current?.observe(el);
    }

    return () => observer.current?.disconnect();
  }, [selectors]);

  return activeId;
}
