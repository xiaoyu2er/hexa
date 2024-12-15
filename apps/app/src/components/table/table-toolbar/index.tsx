import { TableToolbarDesktop } from '@/components/table/table-toolbar/table-toolbar-desktop';
import { TableToolbarMobile } from '@/components/table/table-toolbar/table-toolbar-mobile';
import type { TableToolbarProps } from '@/components/table/table-types';
import { useScreenSize } from '@hexa/ui/hooks/use-screen-size';

export function TableToolbar<TData>(props: TableToolbarProps<TData>) {
  const { isMobile } = useScreenSize();
  const Toolbar = isMobile ? TableToolbarMobile : TableToolbarDesktop;
  return <Toolbar {...props} />;
}
