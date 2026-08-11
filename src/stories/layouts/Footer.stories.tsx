import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Footer from '@/components/layout/Footer';

const meta: Meta<typeof Footer> = {
  title: 'Layouts/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
  },
};
