import { cn } from '@hexa/lib';
import { type SVGProps, forwardRef } from 'react';

export const GoogleDocsIcon = forwardRef<
  SVGSVGElement,
  SVGProps<SVGSVGElement>
>(({ className, ...props }, ref) => (
  <svg
    width="24"
    height="24"
    viewBox="-8 -8 60 80"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    className={cn(className)}
    {...props}
  >
    <title>GoogleDocsIcon</title>
    <path
      fill="#4285F4"
      d="M29.375,0 L4.40625,0 C1.9828125,0 0,1.99431818 0,4.43181818 L0,60.5681818 C0,63.0056818 1.9828125,65 4.40625,65 L42.59375,65 C45.0171875,65 47,63.0056818 47,60.5681818 L47,17.7272727 L29.375,0 Z"
    />
    <path
      fill="#F1F1F1"
      d="M11.75,47.2727273 L35.25,47.2727273 L35.25,44.3181818 L11.75,44.3181818 L11.75,47.2727273 Z M11.75,53.1818182 L29.375,53.1818182 L29.375,50.2272727 L11.75,50.2272727 L11.75,53.1818182 Z M11.75,32.5 L11.75,35.4545455 L35.25,35.4545455 L35.25,32.5 L11.75,32.5 Z M11.75,41.3636364 L35.25,41.3636364 L35.25,38.4090909 L11.75,38.4090909 L11.75,41.3636364 Z"
    />
    <path
      fill="#A1C2FA"
      d="M29.375,0 L29.375,13.2954545 C29.375,15.7440341 31.3467969,17.7272727 33.78125,17.7272727 L47,17.7272727 L29.375,0 Z"
    />
  </svg>
));

GoogleDocsIcon.displayName = 'GoogleDocsIcon';
