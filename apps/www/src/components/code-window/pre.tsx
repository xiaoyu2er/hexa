import { clsx } from '@nextui-org/shared-utils';
import { type ReactNode, forwardRef } from 'react';

export interface PreProps {
  className?: string;
  isScrollable?: boolean;
  children?: ReactNode;
}

export const Pre = forwardRef<HTMLPreElement, PreProps>(
  (
    { className = '', children, isScrollable = true, ...props },
    forwardedRef
  ) => {
    const scrollClass = isScrollable ? 'overflow-scroll' : 'overflow-hidden';

    return (
      <pre
        ref={forwardedRef}
        className={clsx(
          'relative box-border h-full w-full whitespace-pre rounded-xl bg-code-background font-mono text-sm text-white/80 leading-5 shadow-md [&>code]:transition-transform',
          scrollClass,
          className
        )}
        {...props}
      >
        {children}
      </pre>
    );
  }
);

Pre.displayName = 'CodeBlock.Pre';
