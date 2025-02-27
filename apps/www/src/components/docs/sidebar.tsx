'use client';

import { BaseItem } from '@heroui/aria-utils';
import {
  Chip,
  Link as NextUILink,
  Spacer,
  type SpacerProps,
  dataFocusVisibleClasses,
} from '@heroui/react';
import { ChevronIcon } from '@heroui/shared-icons';
import { clsx, dataAttr, debounce, isEmpty } from '@heroui/shared-utils';
import { useFocusRing } from '@react-aria/focus';
import { usePress } from '@react-aria/interactions';
import { useSelectableCollection } from '@react-aria/selection';
import { type TreeState, useTreeState } from '@react-stately/tree';
import type {
  CollectionBase,
  Expandable,
  ItemProps,
  MultipleSelection,
  Node,
} from '@react-types/shared';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import {
  type FC,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ScrollArea } from '../scroll-area';

import { getRoutePaths } from './utils';

import type { Route } from '@/libs/docs/page';
import emitter from '@/libs/emitter';
import { TreeKeyboardDelegate } from '@/utils/tree-keyboard-delegate';

export interface Props<T> extends Omit<ItemProps<T>, 'title'>, Route {
  slug?: string;
  tag?: string;
}

export type BaseItemProps<T extends object> = Props<T>;

const Item = BaseItem as <T extends object>(
  props: BaseItemProps<T>
) => ReactNode;

/**
 * @internal
 */
interface TreeItemProps<T> {
  item: Node<T>;
  state: TreeState<T>;
  level?: number;
  spaceLeft?: SpacerProps['x'];
}

const spacesByLevel: Record<number, SpacerProps['x']> = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
};

function TreeItem<T>(props: TreeItemProps<T>) {
  const { item, state, level = 1, spaceLeft = 0 } = props;
  const { key, rendered, childNodes } = item;

  const router = useRouter();
  const pathname = usePathname();
  const posthog = usePostHog();

  const paths = item.props.path
    ? getRoutePaths(item.props.path, item.props?.tag)
    : {
        pagePath: '',
        pathname: '',
      };

  const isNew = item.props?.newPost;
  const isUpdated = item.props?.updated;

  const isExpanded = state.expandedKeys.has(key);
  const isSelected =
    state.selectionManager.isSelected(key) ||
    paths.pathname === item.props.slug ||
    paths.pathname === pathname ||
    paths.pagePath === pathname;

  const ref = useRef<HTMLElement>(null);

  const hasChildNodes = !isEmpty([...childNodes]);

  const Component = hasChildNodes ? 'ul' : 'li';

  const cn = clsx(
    'w-full',
    'font-normal',
    'before:mr-4',
    "before:content-['']",
    'before:block',
    'before:bg-default-300',
    'before:w-1',
    'before:h-1',
    'before:rounded-full'
  );

  const { pressProps } = usePress({
    onPress: () => {
      if (hasChildNodes) {
        state.toggleKey(item.key);
      } else {
        router.push(paths.pathname);

        posthog.capture('SidebarDocs', {
          category: 'docs',
          action: 'click',
          data: paths.pathname || '',
        });
      }
    },
  });

  const { focusProps, isFocused, isFocusVisible } = useFocusRing();

  const renderComponent = () => {
    if (hasChildNodes) {
      return (
        <span className="flex items-center gap-3">
          <span className="font-medium sm:text-sm">{rendered}</span>
          <ChevronIcon
            className={clsx('transition-transform', {
              '-rotate-90': isExpanded,
            })}
          />
        </span>
      );
    }

    return (
      <NextUILink
        as={item.props?.comingSoon ? 'div' : Link}
        className={clsx(cn, {
          'pointer-events-none': item.props?.comingSoon,
        })}
        color="foreground"
        href={item.props?.comingSoon ? '#' : paths.pathname}
      >
        <span
          className={clsx(
            'sm:text-sm',
            isSelected
              ? 'font-medium text-primary dark:text-foreground'
              : 'opacity-80 dark:opacity-60',
            {
              'pointer-events-none': item.props?.comingSoon,
            }
          )}
        >
          {rendered}
        </span>
        {isUpdated && (
          <Chip
            className="ml-1 bg-default-100 py-1 font-medium text-default-500 text-tiny dark:bg-default-100/50 dark:text-default-400"
            color="default"
            size="sm"
            variant="flat"
          >
            Updated
          </Chip>
        )}
        {isNew && (
          <Chip
            className="ml-1 py-1 font-medium text-tiny"
            color="primary"
            size="sm"
            variant="flat"
          >
            New
          </Chip>
        )}
        {item.props?.comingSoon && (
          <Chip
            className="ml-1 py-1 font-medium text-tiny"
            color="secondary"
            size="sm"
            variant="flat"
          >
            Coming soon
          </Chip>
        )}
      </NextUILink>
    );
  };

  return (
    <Component
      {...focusProps}
      // @ts-ignore
      ref={ref}
      aria-expanded={dataAttr(hasChildNodes ? isExpanded : undefined)}
      aria-selected={dataAttr(isSelected)}
      className={clsx(
        'tap-highlight-transparent flex w-full flex-col outline-none',
        hasChildNodes ? 'mb-4' : 'first:mt-4',
        // focus ring
        ...dataFocusVisibleClasses
      )}
      data-focus-visible={isFocusVisible}
      data-focused={isFocused}
      role="treeitem"
    >
      <div
        className={clsx('flex cursor-pointer items-center gap-3', {
          'pointer-events-none': item.props?.comingSoon,
        })}
        {...(item.props?.comingSoon ? {} : pressProps)}
      >
        <Spacer x={spaceLeft} />
        {renderComponent()}
        {/* Workaround to avoid scrollbar overlapping */}
        <Spacer x={4} />
      </div>
      {isExpanded && hasChildNodes && (
        <div className="flex flex-col items-start gap-3">
          {[...childNodes].map((item) => {
            return (
              <TreeItem
                key={item.key}
                item={item}
                level={level + 1}
                spaceLeft={spacesByLevel[level] ?? 0}
                state={state}
                {...item.props}
              />
            );
          })}
        </div>
      )}
    </Component>
  );
}

interface TreeHeadingProps {
  item: {
    rendered: ReactNode;
  };
}

function TreeHeading({ item }: TreeHeadingProps) {
  return <div>{item.rendered}</div>;
}

function Tree<T extends object>(
  props: CollectionBase<T> & Expandable & MultipleSelection
) {
  const state = useTreeState(props);

  const ref = useRef<HTMLDivElement>(null);

  const scrollViewPortRef = useRef<HTMLDivElement>(null);

  const keyboardDelegate = useMemo(
    // @ts-expect-error
    () => new TreeKeyboardDelegate(state.collection, state.disabledKeys),
    [state.collection, state.disabledKeys]
  );

  const { collectionProps } = useSelectableCollection({
    ref,
    selectionManager: state.selectionManager,
    keyboardDelegate,
  });

  /*  Handle scroll preservation */
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPosition = sessionStorage.getItem('docsSidebarScrollPosition');

      if (savedPosition && scrollViewPortRef.current) {
        scrollViewPortRef.current.scrollTop = Number(savedPosition);
      }
    }
  }, []);

  const handleScroll = () => {
    if (typeof window !== 'undefined' && scrollViewPortRef.current) {
      sessionStorage.setItem(
        'docsSidebarScrollPosition',
        scrollViewPortRef.current.scrollTop.toString()
      );
    }
  };

  const debouncedHandleScroll = debounce(handleScroll, 200);

  return (
    <ScrollArea
      ref={ref}
      className="h-full max-w-[90%] lg:max-h-[calc(100vh_-_64px)]"
      role="tree"
      {...collectionProps}
      scrollViewPortRef={scrollViewPortRef as React.RefObject<HTMLDivElement>}
      onScroll={debouncedHandleScroll}
    >
      {[...state.collection].map((item) => {
        if (item.type === 'section') {
          return <TreeHeading key={item.key} item={item} />;
        }

        return <TreeItem key={item.key} item={item} state={state} />;
      })}
    </ScrollArea>
  );
}

export interface DocsSidebarProps {
  routes?: Route[];
  tag?: string;
  slug?: string;
  className?: string;
}

export const DocsSidebar: FC<DocsSidebarProps> = ({
  routes,
  slug,
  tag,
  className,
}) => {
  const [isProBannerVisible, setIsProBannerVisible] = useState(true);

  const expandedKeys = routes?.reduce((keys, route) => {
    if (route.defaultOpen) {
      keys.push(route.key as string);
    }

    return keys;
  }, [] as string[]);

  useEffect(() => {
    emitter.on('proBannerVisibilityChange', (value) => {
      setIsProBannerVisible(value === 'visible');
    });

    return () => {
      emitter.off('proBannerVisibilityChange');
    };
  }, []);

  const treeContent = useMemo(() => {
    return (
      <Tree defaultExpandedKeys={expandedKeys} items={routes || []}>
        {(route) => (
          <Item
            childItems={route.routes}
            slug={slug}
            tag={tag}
            {...route}
            key={route.key || route.title}
          >
            {route.title}
          </Item>
        )}
      </Tree>
    );
  }, [routes, slug, tag]);

  return (
    <div
      className={clsx(
        'z-0 mt-2',
        isProBannerVisible ? 'lg:top-32' : 'lg:top-20',
        className
      )}
    >
      {treeContent}
    </div>
  );
};
