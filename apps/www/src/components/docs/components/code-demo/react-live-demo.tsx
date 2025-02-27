import type { SandpackFiles } from '@codesandbox/sandpack-react';
import * as NextUI from '@heroui/react';
import { clsx } from '@heroui/shared-utils';
import * as intlDateUtils from '@internationalized/date';
import * as reactAriaI18n from '@react-aria/i18n';
import React from 'react';
import * as reactHookFormBase from 'react-hook-form';
import { LiveError, LivePreview, LiveProvider } from 'react-live';

import { BgGridContainer } from '@/components/bg-grid-container';
import { CopyButton } from '@/components/copy-button';
import { GradientBox, type GradientBoxProps } from '@/components/gradient-box';

export interface ReactLiveDemoProps {
  code: string;
  files: SandpackFiles;
  noInline?: boolean;
  height?: string | number;
  isCentered?: boolean;
  isGradientBox?: boolean;
  className?: string;
  gradientColor?: GradientBoxProps['color'];
  overflow?: 'auto' | 'visible' | 'hidden';
}

// 🚨 Do not pass react-hook-form to scope, it will break the live preview since
// it also has a "Form" component that will override the one from @heroui/react
const reactHookForm = {
  useForm: reactHookFormBase.useForm,
  Controller: reactHookFormBase.Controller,
};

export const scope = {
  React,
  ...NextUI,
  ...intlDateUtils,
  ...reactAriaI18n,
  ...reactHookForm,
} as Record<string, unknown>;

const DEFAULT_FILE = '/App.jsx';

export const ReactLiveDemo: React.FC<ReactLiveDemoProps> = ({
  code,
  files,
  isGradientBox,
  gradientColor = 'orange',
  isCentered = false,
  height,
  className,
  noInline,
}) => {
  const content = (
    <>
      {files?.[DEFAULT_FILE] && (
        <div className="absolute top-[-28px] right-[-8px] z-50">
          <CopyButton
            className="text-zinc-400 opacity-0 transition-opacity before:hidden group-hover/code-demo:opacity-100"
            value={files?.[DEFAULT_FILE] as string}
          />
        </div>
      )}
      <LivePreview
        className={clsx('live-preview not-prose flex h-full w-full ', {
          'items-center justify-center': isCentered,
        })}
        style={{ height }}
      />
      <LiveError />
    </>
  );

  return (
    <LiveProvider code={code} noInline={noInline} scope={scope}>
      {isGradientBox ? (
        <GradientBox
          isCentered
          className={clsx(
            className,
            'relative flex items-center overflow-hidden overflow-y-hidden rounded-lg border border-default-200 px-2 py-4 dark:border-default-100'
          )}
          color={gradientColor}
          to="top-right"
        >
          <div className="group/code-demo scrollbar-hide h-full w-full max-w-full overflow-x-scroll px-2 py-4">
            {content}
          </div>
        </GradientBox>
      ) : (
        <BgGridContainer className={clsx(className, 'group/code-demo')}>
          {content}
        </BgGridContainer>
      )}
    </LiveProvider>
  );
};
