import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { InfoSection } from '@/components/landing/InfoSection';

const meta: Meta<typeof InfoSection> = {
  title: 'Layouts/InfoSection',
  component: InfoSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof InfoSection>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
