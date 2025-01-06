import * as Components from '@nextui-org/react';
/* eslint-disable react/display-name */
import { clsx } from '@nextui-org/shared-utils';
import NextImage from 'next/image';
import { usePostHog } from 'posthog-js/react';
import type { Language } from 'prism-react-renderer';
import type { FC, HTMLAttributes, JSX, ReactNode } from 'react';

import { InfoCircle } from './icons/info-circle';
import { ThemeSwitch } from './theme-switch';

import * as BlogComponents from '@/components/blog/components';
import * as DocsComponents from '@/components/docs/components';
import { Codeblock } from '@/components/docs/components';
import { Sandpack } from '@/components/sandpack';
import {
  Table as StaticTable,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow,
} from '@/components/static-table';
import {
  VirtualAnchor,
  virtualAnchorEncode,
} from '@/components/virtual-anchor';

import { AnimatedBeamMultipleOutputDemo } from '@/components/animated-beam';
import { CodeDemo } from '@/components/docs/components/code-demo/code-demo';
import { Features } from '@/components/docs/components/features';
import { Frameworks } from '@/components/docs/components/frameworks';
import { FeaturesGrid } from '@/components/marketing/features-grid';

const Table: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table className="w-full border-collapse border-spacing-0">
        {children}
      </table>
    </div>
  );
};

const Thead: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <thead
      className={clsx(
        '[&>tr]:h-12',
        '[&>tr>th]:py-0',
        '[&>tr>th]:align-middle',
        '[&>tr>th]:bg-default-400/20',
        'dark:[&>tr>th]:bg-default-600/10',
        '[&>tr>th]:text-default-600 [&>tr>th]:text-xs',
        '[&>tr>th]:pl-2 [&>tr>th]:text-left',
        '[&>tr>th:first-child]:rounded-l-lg',
        '[&>tr>th:last-child]:rounded-r-lg'
      )}
    >
      {children}
    </thead>
  );
};
const Trow: FC<{ children?: ReactNode }> = ({ children }) => {
  return <tr>{children}</tr>;
};

const Tcol: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <td className="max-w-[200px] overflow-auto whitespace-normal break-normal p-2 text-sm">
      {children}
    </td>
  );
};

export interface LinkedHeadingProps {
  as: keyof JSX.IntrinsicElements;
  id?: string;
  linked?: boolean;
  children?: ReactNode;
  className?: string;
}

const linkedLevels: Record<string, number> = {
  h1: 0,
  h2: 1,
  h3: 2,
  h4: 3,
};

const LinkedHeading: FC<LinkedHeadingProps> = ({
  as,
  linked = true,
  id: idProp,
  className,
  ...props
}) => {
  const Component = as;

  const level = linkedLevels[as] || 1;

  const id = idProp || virtualAnchorEncode(props.children as string);

  return (
    <Component
      className={clsx({ 'linked-heading': linked }, linked ? {} : className)}
      data-id={id}
      data-level={level}
      data-name={props.children}
      id={id}
      {...props}
    >
      {linked ? (
        <VirtualAnchor id={id}>{props.children}</VirtualAnchor>
      ) : (
        <>{props.children}</>
      )}
    </Component>
  );
};

const List: FC<{ children?: ReactNode }> = ({ children }) => {
  return (
    <ul className="mt-2 ml-4 flex list-disc flex-col gap-2 [&>li>strong]:font-medium [&>li>strong]:text-foreground">
      {children}
    </ul>
  );
};

const InlineCode = ({
  children,
  className,
}: { children?: ReactNode; className?: string }) => {
  return (
    <Components.Code
      className={clsx(
        'p-0 relative before:content-["`"] after:content-["`"] font-semibold font-mono text-small rounded-md text-default-900 dark:text-default-500 bg-transparent',
        className
      )}
    >
      {children}
    </Components.Code>
  );
};

const Code = ({
  className,
  children,
  meta,
}: {
  children?: ReactNode;
  className?: string;
  meta?: string;
}) => {
  const isMultiLine = (children as string)?.split?.('\n')?.length > 2;
  const language = (className?.replace(/language-/, '') ?? 'jsx') as Language;
  const codeString = String(children).trim();
  const posthog = usePostHog();

  if (!className) {
    return <InlineCode>{children}</InlineCode>;
  }

  return (
    <Components.Snippet
      disableTooltip
      fullWidth
      hideSymbol
      classNames={{
        base: clsx(
          'bg-code-background px-0 text-code-foreground',
          {
            'items-start': isMultiLine,
          },
          className
        ),
        pre: 'font-light w-full text-sm',
        copyButton: 'text-lg text-zinc-500 mr-2',
      }}
      codeString={codeString}
      onCopy={() => {
        posthog.capture('MDXComponents - Copy', {
          category: 'docs',
          action: 'copyCode',
        });
      }}
    >
      <Codeblock
        className="sp-editor"
        codeString={codeString}
        language={language}
        metastring={meta}
      />
    </Components.Snippet>
  );
};

const Link = ({ href, children }: { href?: string; children?: ReactNode }) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('https');
  const posthog = usePostHog();

  const handleClick = () => {
    posthog.capture('MDXComponents - Click', {
      category: 'docs',
      action: 'click',
      data: href || '',
    });
  };

  const externalProps = isExternal
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Components.Link
      className="relative hover:opacity-100 text-foreground font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:rounded-full after:h-[1px] after:bg-primary-400 dark:after:bg-default-300 hover:after:h-[2px]"
      disableAnimation={true}
      href={href}
      {...externalProps}
      onPress={handleClick}
    >
      {children}
    </Components.Link>
  );
};

const InlineCodeChip = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => {
  return (
    <InlineCode
      className={clsx(
        'before:hidden after:hidden text-tiny rounded-md text-default-600 bg-default-100 dark:bg-default-100/80 px-1.5 py-0.5',
        className
      )}
    >
      {children}
    </InlineCode>
  );
};

interface APITableProps {
  data: {
    attribute: string;
    type: string;
    description: string;
    deprecated?: boolean;
    default?: string;
  }[];
}

export const APITable: FC<APITableProps> = ({ data }) => {
  return (
    <TableRoot className="overflow-x-auto overflow-y-hidden">
      <StaticTable aria-label="API table" className="w-full" layout="auto">
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Prop</TableColumnHeader>
            <TableColumnHeader>Type</TableColumnHeader>
            <TableColumnHeader>Default</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              className="[&>td]:px-2 [&>td]:py-1.5 [&>td]:first:pt-4"
            >
              {/* biome-ignore lint/nursery/useSortedClasses: <explanation> */}
              <TableCell className="flex items-center gap-1 font-mono text-small whitespace-nowrap">
                <InlineCodeChip
                  className={item.deprecated ? 'line-through' : ''}
                >
                  {item.attribute}
                </InlineCodeChip>
                {item.description && (
                  <>
                    {/* Desktop tooltip */}
                    <Components.Tooltip
                      classNames={{
                        content: 'max-w-[240px]',
                      }}
                      content={item.description}
                      delay={0}
                      placement="top"
                    >
                      <div className="flex hidden cursor-default items-center gap-1 sm:block">
                        <InfoCircle className="text-default-400" size={16} />
                      </div>
                    </Components.Tooltip>
                    {/* Mobile popover */}
                    <Components.Popover placement="top">
                      <Components.PopoverTrigger>
                        <button
                          type="button"
                          className="flex items-center gap-1 outline-none sm:hidden"
                        >
                          <InfoCircle className="text-default-400" size={16} />
                        </button>
                      </Components.PopoverTrigger>
                      <Components.PopoverContent className="max-w-[240px]">
                        {item.description}
                      </Components.PopoverContent>
                    </Components.Popover>
                  </>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap font-mono text-primary text-small">
                <InlineCodeChip>
                  <div className="flex max-w-[300px] flex-wrap text-wrap">
                    {item.type}
                  </div>
                </InlineCodeChip>
              </TableCell>
              <TableCell className="whitespace-nowrap font-mono text-small">
                {item.default && item.default !== '-' ? (
                  <InlineCodeChip>
                    {item.default !== 'true' && item.default !== 'false'
                      ? `"${item.default}"`
                      : item.default}
                  </InlineCodeChip>
                ) : (
                  <svg
                    aria-hidden="true"
                    className="text-default-400"
                    fill="none"
                    focusable="false"
                    height="15"
                    viewBox="0 0 15 15"
                    width="15"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M2 7.5C2 7.22386 2.22386 7 2.5 7H12.5C12.7761 7 13 7.22386 13 7.5C13 7.77614 12.7761 8 12.5 8H2.5C2.22386 8 2 7.77614 2 7.5Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StaticTable>
    </TableRoot>
  );
};

export const MDXComponents = {
  /**
   * Next.js components
   */
  NextImage,
  /**
   * NextUI components
   */
  ...Components,
  /**
   * Docs components
   */
  ...DocsComponents,
  Sandpack,
  ThemeSwitch,
  /**
   * Blog components
   */
  ...BlogComponents,
  /**
   * Markdown components
   */
  // ...Icons,
  h1: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <LinkedHeading as="h1" linked={false} {...props} />
  ),
  h2: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <LinkedHeading as="h2" {...props} />
  ),
  h3: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <LinkedHeading as="h3" {...props} />
  ),
  h4: (props: HTMLAttributes<HTMLHeadingElement>) => (
    <LinkedHeading as="h4" {...props} />
  ),
  strong: (props: HTMLAttributes<HTMLElement>) => <strong {...props} />,
  table: Table,
  thead: Thead,
  tr: Trow,
  td: Tcol,
  code: Code,
  ul: List,
  a: (props: HTMLAttributes<HTMLAnchorElement>) => <Link {...props} />,
  blockquote: (props: Omit<HTMLAttributes<HTMLElement>, 'color'>) => (
    <DocsComponents.Blockquote {...props} />
  ),
  kbd: (props: HTMLAttributes<HTMLElement>) => (
    <Components.Kbd {...props} className="px-1.5 py-0.5" />
  ),
  Steps: ({ ...props }) => (
    <div
      className="[&>h3]:step [&>h3>a]:pt-0.5 [&>h4]:step [&>h4>a]:pt-0.5 mb-12 ml-4 relative border-l border-default-100 pl-[1.625rem] [counter-reset:step]"
      {...props}
    />
  ),
  APITable,
  // Block,
  Frameworks,
  Features,
  CodeDemo,
  AnimatedBeamMultipleOutputDemo,
  FeaturesGrid,
} as unknown as Record<string, ReactNode>;
