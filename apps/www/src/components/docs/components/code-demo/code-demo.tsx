'use client';

import { Skeleton, Tab, Tabs } from '@heroui/react';
import { useInView } from 'framer-motion';
import dynamic from 'next/dynamic';
import type React from 'react';
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { type UseCodeDemoProps, useCodeDemo } from './use-code-demo';
import WindowResizer, { type WindowResizerProps } from './window-resizer';

import type { GradientBoxProps } from '@/components/gradient-box';

const DynamicReactLiveDemo = dynamic(
  () => import('./react-live-demo').then((m) => m.ReactLiveDemo),
  {
    ssr: false,
    // eslint-disable-next-line react/display-name
    loading: () => <Skeleton className="h-24 w-full rounded-xl" />,
  }
);

const DynamicSandpack = dynamic(
  () => import('../../../sandpack').then((m) => m.Sandpack),
  {
    ssr: false,
    // eslint-disable-next-line react/display-name
    loading: () => <Skeleton className="h-32 w-full rounded-xl" />,
  }
);

interface CodeDemoProps extends UseCodeDemoProps, WindowResizerProps {
  title?: string;
  asIframe?: boolean;
  showSandpackPreview?: boolean;
  initialEditorOpen?: boolean;
  enableResize?: boolean;
  showPreview?: boolean;
  hideWindowActions?: boolean;
  showOpenInCodeSandbox?: boolean;
  isPreviewCentered?: boolean;
  resizeEnabled?: boolean;
  typescriptStrict?: boolean;
  displayMode?: 'always' | 'visible';
  isGradientBox?: boolean;
  gradientColor?: GradientBoxProps['color'];
  previewHeight?: string | number;
  overflow?: 'auto' | 'visible' | 'hidden';
  className?: string;
}

export const CodeDemo: React.FC<CodeDemoProps> = ({
  files = {},
  title,
  showEditor = true,
  showPreview = true,
  asIframe = false,
  showTabs = true,
  resizeEnabled = true,
  hideWindowActions = false,
  showSandpackPreview = false,
  isPreviewCentered = false,
  // when false .js files will be used
  typescriptStrict = false,
  showOpenInCodeSandbox = true,
  isGradientBox = false,
  previewHeight = 'auto',
  overflow = 'visible',
  displayMode = 'always',
  gradientColor,
  highlightedLines,
  iframeInitialWidth,
  iframeSrc,
  className,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref as unknown as RefObject<Element>, {
    once: true,
    margin: '600px',
  });

  const { noInline, code } = useCodeDemo({
    files,
  });

  const renderContent = useCallback(
    (content: ReactNode) => {
      if (displayMode === 'always') {
        return content;
      }
      if (displayMode === 'visible') {
        if (!isInView) {
          return <div style={{ height: previewHeight }} />;
        }

        return content;
      }
    },
    [displayMode, previewHeight, isInView]
  );

  const previewContent = useMemo(() => {
    if (!showPreview) {
      return null;
    }

    const content = asIframe ? (
      <WindowResizer
        hideWindowActions={hideWindowActions}
        iframeHeight={previewHeight}
        iframeInitialWidth={iframeInitialWidth}
        iframeSrc={iframeSrc}
        iframeTitle={title}
        resizeEnabled={resizeEnabled}
      />
    ) : (
      <DynamicReactLiveDemo
        className={className}
        code={code}
        files={files}
        gradientColor={gradientColor}
        height={previewHeight}
        isCentered={isPreviewCentered}
        isGradientBox={isGradientBox}
        noInline={noInline}
        overflow={overflow}
      />
    );

    return renderContent(content);
  }, [
    displayMode,
    isGradientBox,
    gradientColor,
    previewHeight,
    hideWindowActions,
    asIframe,
    showPreview,
    isInView,
    className,
  ]);

  const editorContent = useMemo(() => {
    if (!showEditor) {
      return null;
    }

    const content = (
      <DynamicSandpack
        files={files}
        highlightedLines={highlightedLines}
        showEditor={showEditor}
        showOpenInCodeSandbox={showOpenInCodeSandbox}
        showPreview={showSandpackPreview}
        typescriptStrict={typescriptStrict}
      />
    );

    return renderContent(content);
  }, [
    displayMode,
    showEditor,
    isInView,
    files,
    highlightedLines,
    showPreview,
    showSandpackPreview,
    showOpenInCodeSandbox,
  ]);

  const shouldRenderTabs = useMemo(() => {
    if (!showTabs) {
      return false;
    }
    if (!showPreview) {
      return false;
    }
    if (!showEditor) {
      return false;
    }

    return true;
  }, [showTabs, showPreview, showEditor]);

  return (
    <div ref={ref} className="flex flex-col gap-2">
      {shouldRenderTabs ? (
        <Tabs
          disableAnimation
          aria-label="Code demo tabs"
          classNames={{
            panel: 'pt-0',
          }}
          variant="underlined"
        >
          <Tab key="preview" title="Preview">
            {previewContent}
          </Tab>
          <Tab key="code" title="Code">
            {editorContent}
          </Tab>
        </Tabs>
      ) : (
        <>
          {previewContent}
          {editorContent}
        </>
      )}
    </div>
  );
};
