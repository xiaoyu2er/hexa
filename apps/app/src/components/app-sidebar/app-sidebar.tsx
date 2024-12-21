'use client';

import { BackButton } from '@/components/app-sidebar/app-sidebar-back-button';
import { AppSidebarContent } from '@hexa/ui/app-sidebar-content';
import { AppSidebarFooter } from '@hexa/ui/app-sidebar-footer';
import type { SidebarGroupItem } from '@hexa/ui/app-sidebar-type';
import {
  getAdminSidebarItems,
  getBottomSidebarItems,
  getProjectSidebarItems,
  getSettingsSidebarItems,
} from '@hexa/ui/app-sidebar-util';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, usePathname } from 'next/navigation';
import { ContextSwitcher } from '../context-switcher';

const variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function AppSidebar() {
  const { slug } = useParams() as { slug: string };
  const pathname = usePathname();
  const isProjectSettingsSidebar =
    pathname.startsWith(`/project/${slug}/settings`) ||
    pathname.startsWith('/user');
  const isAdminSidebar = pathname.startsWith('/admin');

  let sidebarItems: SidebarGroupItem[] = [];

  if (isProjectSettingsSidebar) {
    sidebarItems = getSettingsSidebarItems(slug);
  } else if (isAdminSidebar) {
    sidebarItems = getAdminSidebarItems();
  } else if (slug) {
    sidebarItems = getProjectSidebarItems(slug);
  }

  return (
    <Sidebar variant="floating" collapsible="icon">
      <div className="flex h-full flex-col">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <AnimatePresence mode="wait">
                {isProjectSettingsSidebar || isAdminSidebar ? (
                  <motion.div
                    key="back-button"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                  >
                    <BackButton slug={slug} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="context-switcher"
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.2 }}
                  >
                    <ContextSwitcher />
                  </motion.div>
                )}
              </AnimatePresence>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <motion.div
          // @ts-ignore
          className="flex-1 overflow-y-auto"
          initial="initial"
          animate="animate"
          variants={variants}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <AppSidebarContent items={sidebarItems} pathname={pathname} />
        </motion.div>

        <div>
          <AppSidebarContent
            items={getBottomSidebarItems()}
            pathname={pathname}
          />
        </div>

        <AppSidebarFooter />
      </div>
    </Sidebar>
  );
}
