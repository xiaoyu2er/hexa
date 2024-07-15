"use client";

import { useMediaQuery } from "@hexa/ui/hooks";
import { cn } from "@hexa/utils";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

type StatefulContent = (_props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => ReactNode | ReactNode[];

export const ResponsiveDialog = (props: {
  trigger: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode | ReactNode[] | StatefulContent;
  footer?: ReactNode;
  contentClassName?: string;
}) => {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  return isDesktop ? (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.trigger}</DialogTrigger>
      <DialogContent className={cn("max-w-md", props.contentClassName)}>
        <DialogHeader>
          <DialogTitle>{props.title}</DialogTitle>
          <DialogDescription>{props.description}</DialogDescription>
        </DialogHeader>
        {isFunctionType(props.children)
          ? props.children({ open, setOpen })
          : props.children}
      </DialogContent>
      {props.footer ? <DialogFooter>{props.footer}</DialogFooter> : null}
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{props.trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        <div className={cn("px-4", props.contentClassName)}>
          {isFunctionType(props.children)
            ? props.children({ open, setOpen })
            : props.children}
        </div>
        <DrawerFooter className="pt-2">
          {props.footer ? (
            props.footer
          ) : (
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

const isFunctionType = (
  prop: ReactNode | ReactNode[] | StatefulContent,
): prop is (_props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => ReactNode | ReactNode[] => {
  return typeof prop === "function";
};
