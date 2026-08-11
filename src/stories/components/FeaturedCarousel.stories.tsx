import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FeaturedCarousel } from '@/components/landing/FeaturedCarousel';
import { withToastProvider } from '../_decorators';
import { mockProducts6 } from '../_mocks';

const meta: Meta<typeof FeaturedCarousel> = {
  title: 'Components/FeaturedCarousel',
  component: FeaturedCarousel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withToastProvider],
};

export default meta;
type Story = StoryObj<typeof FeaturedCarousel>;

export const Default: Story = {
  args: {
    products: mockProducts6,
  },
};

export const MobileView: Story = {
  args: {
    products: mockProducts6,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
  },
};

export const TabletView: Story = {
  args: {
    products: mockProducts6,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};
