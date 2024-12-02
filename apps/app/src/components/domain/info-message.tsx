import { InfoIcon } from '@hexa/ui/icons';

interface InfoMessageProps {
  variant: 'blue' | 'orange';
  children: React.ReactNode;
}

export function InfoMessage({ variant, children }: InfoMessageProps) {
  const colors = {
    blue: 'bg-indigo-50 text-indigo-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <div
      className={`mt-4 flex items-center gap-2 rounded-lg p-3 ${colors[variant]}`}
    >
      <InfoIcon className="h-4 w-4 shrink-0" />
      <p className="prose-sm max-w-none prose-code:rounded-md prose-code:bg-gray-100 prose-code:p-1 prose-code:font-medium prose-code:font-mono prose-code:text-[.8125rem] prose-code:text-gray-900">
        {children}
      </p>
    </div>
  );
}
