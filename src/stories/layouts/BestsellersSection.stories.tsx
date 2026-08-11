import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { BestsellersSection } from '@/components/landing/BestsellersSection';
import { withToastProvider } from '../_decorators';
import { mockProducts3 } from '../_mocks';

const meta: Meta<typeof BestsellersSection> = {
  title: 'Layouts/BestsellersSection',
  component: BestsellersSection,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withToastProvider],
};

export default meta;
type Story = StoryObj<typeof BestsellersSection>;

export const Default: Story = {
  args: {
    products: mockProducts3,
  },
};

export const MobileView: Story = {
  args: {
    products: mockProducts3,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
  },
};

export const Empty: Story = {
  args: {
    products: [],
  },
};
