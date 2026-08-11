import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import MobileProductCard from '@/components/product/MobileProductCard';
import {
  mockProduct,
  mockProductFeatured,
  mockProductOutOfStock,
  mockProductLowStock,
  mockProductLongTitle,
} from '../_mocks';

const meta: Meta<typeof MobileProductCard> = {
  title: 'Components/MobileProductCard',
  component: MobileProductCard,
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="p-4 flex justify-center">
        <div className="w-full max-w-sm h-[540px]">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileProductCard>;

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const Featured: Story = {
  args: {
    product: mockProductFeatured,
  },
};

export const OutOfStock: Story = {
  args: {
    product: mockProductOutOfStock,
  },
};

export const LowStock: Story = {
  args: {
    product: mockProductLowStock,
  },
};

export const LongTitle: Story = {
  args: {
    product: mockProductLongTitle,
  },
};
