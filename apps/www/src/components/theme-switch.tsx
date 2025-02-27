'use client';

import { type SwitchProps, useSwitch } from '@heroui/react';
import { clsx } from '@heroui/shared-utils';
import { useIsSSR } from '@react-aria/ssr';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { useTheme } from 'next-themes';
import { usePostHog } from 'posthog-js/react';
import type { ChangeEvent, FC } from 'react';

import { MoonIcon, SunLinearIcon } from '@/components/icons';

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps['classNames'];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
  className,
  classNames,
}) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();
  const posthog = usePostHog();

  const initialTheme = isSSR ? 'light' : theme;

  const handleThemeChange = (
    e?: ChangeEvent<HTMLInputElement> | React.MouseEvent | React.KeyboardEvent
  ) => {
    e?.preventDefault();
    e?.stopPropagation();

    const newTheme = theme === 'light' ? 'dark' : 'light';

    setTheme(newTheme);

    posthog.capture('ThemeChange', {
      action: 'click',
      category: 'theme',
      data: newTheme,
    });
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: initialTheme === 'light',
    'aria-label': `Switch to ${initialTheme === 'light' ? 'dark' : 'light'} mode`,
    onChange: handleThemeChange as (
      event: ChangeEvent<HTMLInputElement>
    ) => void,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          'h-8 w-8 cursor-pointer p-1 transition-opacity hover:opacity-80',
          className,
          classNames?.base
        ),
        onClick: handleThemeChange,
        onKeyDown: (e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleThemeChange(e);
          }
        },
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              'h-auto w-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              '!text-default-600 dark:!text-default-300',
              'pt-0',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <SunLinearIcon size={22} />
        ) : (
          <MoonIcon size={22} />
        )}
      </div>
    </Component>
  );
};
