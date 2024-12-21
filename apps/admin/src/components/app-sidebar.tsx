'use client';

import { BackButton } from '@/components/app-sidebar-back-button';
import { AppSidebarContent } from '@hexa/ui/app-sidebar-content';
import { AppSidebarFooter } from '@hexa/ui/app-sidebar-footer';
import type { SidebarGroupItem } from '@hexa/ui/app-sidebar-type';
import {
  getAdminSidebarItems,
  getBottomSidebarItems,
} from '@hexa/ui/app-sidebar-util';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@hexa/ui/sidebar';
import { AnimatePresence, motion } from 'framer-motion';
import { useParams, usePathname } from 'next/navigation';

const variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export function AppSidebar() {
  const { slug } = useParams() as { slug: string };
  const pathname = usePathname();

  const sidebarItems: SidebarGroupItem[] = getAdminSidebarItems();

  return (
    <Sidebar variant="floating" collapsible="icon">
      <div className="flex h-full flex-col">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <AnimatePresence mode="wait">
                <motion.div
                  key="back-button"
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.2 }}
                >
                  <BackButton />
                </motion.div>
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
