import type { Meta, StoryObj } from '@storybook/react';

import { AutosizeTextarea } from '@hexa/ui/autosize-textarea';

const meta: Meta<typeof AutosizeTextarea> = {
  component: AutosizeTextarea,
};

export default meta;
type Story = StoryObj<typeof AutosizeTextarea>;

export const Primary: Story = {
  args: {
    placeholder: 'This textarea with min height 52 and max height 400',
    maxHeight: 400,
    minHeight: 52,
  },
};
