'use client';

import { AppSidebarContent } from '@/components/sidebar/app-sidebar-content';
import { AppSidebarFooter } from '@/components/sidebar/app-sidebar-footer';
import { ContextSwitcher } from '@/components/sidebar/context-switcher';
import type { SidebarGroupItem } from '@/components/sidebar/type';
import {
  getAdminSidebarItems,
  getBottomSidebarItems,
  getProjectSidebarItems,
  getSettingsSidebarItems,
} from '@/components/sidebar/util';
import { ArrowLeft } from '@hexa/ui/icons';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

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
                    <SidebarMenuButton asChild className="h-10">
                      <Link href={slug ? `/project/${slug}` : '/'}>
                        <ArrowLeft />
                        <span>Main Menu</span>
                      </Link>
                    </SidebarMenuButton>
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
