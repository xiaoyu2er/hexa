import { Button, type ButtonProps } from '@nextui-org/react';
import { clsx } from '@nextui-org/shared-utils';
import { useClipboard } from '@nextui-org/use-clipboard';
import type { FC } from 'react';

import { CheckLinearIcon, CopyLinearIcon } from '@/components/icons';

export interface CopyButtonProps extends ButtonProps {
  value?: string;
}

export const CopyButton: FC<CopyButtonProps> = ({
  value,
  className,
  ...buttonProps
}) => {
  const { copy, copied } = useClipboard();

  const handleCopy = () => {
    copy(value);
  };

  return (
    <Button
      isIconOnly
      className={clsx(
        "absolute z-50 right-3 text-zinc-300 top-8 border-1 border-transparent bg-transparent before:bg-white/10 before:content-[''] before:block before:z-[-1] before:absolute before:inset-0 before:backdrop-blur-md before:backdrop-saturate-100 before:rounded-lg",
        className
      )}
      size="sm"
      variant="bordered"
      onPress={handleCopy}
      {...buttonProps}
    >
      <CheckLinearIcon
        className="absolute scale-50 opacity-0 transition-transform-opacity data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
        data-visible={copied}
        size={16}
      />
      <CopyLinearIcon
        className="absolute scale-50 opacity-0 transition-transform-opacity data-[visible=true]:scale-100 data-[visible=true]:opacity-100"
        data-visible={!copied}
        size={16}
      />
    </Button>
  );
};
