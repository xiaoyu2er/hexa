'use client';
import type {} from '@/components/table/table-types';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';
import { Settings2 } from '@hexa/ui/icons';

import { Badge, Button } from '@nextui-org/react';
import { type ComponentProps, forwardRef } from 'react';

export const TableViewOptionsButton = forwardRef<
  HTMLButtonElement,
  {
    hasFiltersOrSort: boolean;
  } & ComponentProps<typeof Button>
>(({ hasFiltersOrSort, onPress }, ref) => {
  const { isMobile } = useScreenSize();

  return (
    <Badge content="" color="primary" isInvisible={!hasFiltersOrSort}>
      <Button
        ref={ref}
        variant="bordered"
        size="sm"
        isIconOnly={isMobile}
        startContent={<Settings2 className="h-4 w-4" />}
        className="relative ml-auto flex items-center gap-2"
        onPress={onPress}
      >
        {!isMobile && <span>Display</span>}
      </Button>
    </Badge>
  );
});
