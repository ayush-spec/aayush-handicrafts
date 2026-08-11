import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FilterFAB from '@/components/product/FilterFAB';

const meta: Meta<typeof FilterFAB> = {
  title: 'Components/FilterFAB',
  component: FilterFAB,
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FilterFAB>;

export const Default: Story = {
  args: {
    onClick: () => alert('Filter clicked'),
  },
};

export const DesktopView: Story = {
  args: {
    onClick: () => alert('Filter clicked'),
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
