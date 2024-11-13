'use client';

import { Button } from '@hexa/ui/button';
import { EyeCloseIcon, EyeOpenIcon } from '@hexa/ui/icons';
import { Input, type InputProps } from '@hexa/ui/input';
import React from 'react';

import { cn } from '@hexa/utils';

const PasswordInputComponent = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.value === '' || props.disabled}
        >
          {showPassword ? (
            <EyeCloseIcon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <EyeOpenIcon className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </Button>
      </div>
    );
  }
);
PasswordInputComponent.displayName = 'PasswordInput';

export const PasswordInput = PasswordInputComponent;
