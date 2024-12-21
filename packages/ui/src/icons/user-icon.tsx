import { type SVGProps, forwardRef } from 'react';
import { cn } from '../../../lib/src';

export const UserIcon = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  ({ className, ...props }, ref) => (
    <svg
      width="24"
      height="24"
      ref={ref}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      className={cn(className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>UserIcon</title>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
);

UserIcon.displayName = 'UserIcon';
