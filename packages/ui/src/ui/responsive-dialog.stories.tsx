import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@hexa/ui/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@hexa/ui/responsive-dialog';
import { useState } from 'react';

function StateModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpen}>Open with State</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>
              A responsive modal component for shadcn/ui.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>This modal got triggered using state</DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

const meta: Meta<typeof Dialog> = {
  render: () => <StateModal />,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Primary: Story = {};
