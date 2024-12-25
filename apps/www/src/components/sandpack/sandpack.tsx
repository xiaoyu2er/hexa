'use client';

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import { type FC, type ReactNode, useRef } from 'react';

import { BugReportButton } from './bugreport-button';
import { SandpackCodeViewer } from './code-viewer';
import { CodeSandboxButton } from './codesandbox-button';
import { CopyButton } from './copy-button';
import { LanguageSelector } from './language-selector';
import { nextuiTheme } from './theme';
import { type UseSandpackProps, useSandpack } from './use-sandpack';

export interface SandpackProps extends UseSandpackProps {
  showTabs?: boolean;
  showPreview?: boolean;
  showEditor?: boolean;
  showCopyCode?: boolean;
  showReportBug?: boolean;
  showOpenInCodeSandbox?: boolean;
  children?: ReactNode;
}

export const Sandpack: FC<SandpackProps> = ({
  files: filesProp,
  template,
  highlightedLines,
  typescriptStrict = false,
  showPreview = false,
  showEditor = true,
  showOpenInCodeSandbox = true,
  showReportBug = true,
  showCopyCode = true,
  showTabs,
  children,
}) => {
  const editorContainerRef = useRef(null);

  const {
    files,
    decorators,
    customSetup,
    sandpackTemplate,
    hasTypescript,
    setCurrentTemplate,
  } = useSandpack({
    files: filesProp,
    template,
    typescriptStrict,
    highlightedLines,
  });

  return (
    <SandpackProvider
      customSetup={customSetup}
      files={files}
      template={sandpackTemplate}
      theme={nextuiTheme}
    >
      <SandpackLayout
        style={{
          // @ts-ignore
          '--sp-border-radius': '0.5rem',
        }}
      >
        <div className="flex w-full flex-col">
          <div>{showPreview ? <SandpackPreview /> : children}</div>
          <div ref={editorContainerRef} className="group relative h-auto pt-2">
            {showEditor && (
              <SandpackCodeViewer
                containerRef={
                  editorContainerRef as unknown as React.RefObject<HTMLDivElement>
                }
                decorators={decorators}
                highlightedLines={highlightedLines}
                showTabs={showTabs}
              />
            )}
            <div className="absolute top-2 right-2 z-20 hidden items-center justify-center gap-0 bg-code-background opacity-0 transition-opacity group-hover:opacity-100 md:flex">
              {showReportBug && <BugReportButton />}
              {showCopyCode && <CopyButton />}
              {!showPreview && showOpenInCodeSandbox && <CodeSandboxButton />}
            </div>
            {hasTypescript && sandpackTemplate && (
              <LanguageSelector
                template={sandpackTemplate}
                onChange={setCurrentTemplate}
              />
            )}
          </div>
        </div>
      </SandpackLayout>
    </SandpackProvider>
  );
};
