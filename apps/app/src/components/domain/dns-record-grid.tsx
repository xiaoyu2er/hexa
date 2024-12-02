import { CopyButton } from '@hexa/ui/copy-button';
import { cn } from '@hexa/utils/cn';

interface DNSRecordGridProps {
  columns: {
    header: string;
    value: string;
    copy?: boolean;
    hideOnMobile?: boolean;
  }[];
}

export function DNSRecordGrid({ columns }: DNSRecordGridProps) {
  return (
    <div
      className={cn(
        'scrollbar-hide grid items-end gap-x-10 gap-y-1 overflow-x-auto rounded-lg bg-gray-100/80 p-4 text-sm',
        columns.length < 4
          ? 'grid-cols-[repeat(3,min-content)]'
          : 'grid-cols-[repeat(4,min-content)]'
      )}
    >
      {/* Headers */}
      {columns.map((column) => (
        <p key={column.header} className="font-medium text-gray-950">
          {column.header}
        </p>
      ))}

      {/* Values */}
      {columns.map((column) => (
        <p
          key={column.value}
          className="flex items-end gap-1 whitespace-nowrap font-mono"
        >
          <span
            className={
              column.hideOnMobile
                ? 'hidden truncate sm:inline sm:max-w-[300px]'
                : 'truncate'
            }
          >
            {column.value}
          </span>
          {column.copy && <CopyButton value={column.value} />}
        </p>
      ))}
    </div>
  );
}
