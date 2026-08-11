import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import ProductCard from '@/components/product/ProductCard';
import { withToastProvider } from '../_decorators';
import {
  mockProduct,
  mockProductFeatured,
  mockProductBestseller,
  mockProductOutOfStock,
  mockProductWithVariants,
  mockProductLongTitle,
} from '../_mocks';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    withToastProvider,
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

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

export const Bestseller: Story = {
  args: {
    product: mockProductBestseller,
  },
};

export const OutOfStock: Story = {
  args: {
    product: mockProductOutOfStock,
  },
};

export const WithVariants: Story = {
  args: {
    product: mockProductWithVariants,
  },
};

export const LongTitle: Story = {
  args: {
    product: mockProductLongTitle,
  },
};

export const InGrid: Story = {
  decorators: [
    withToastProvider,
    (Story) => (
      <div className="max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCard product={mockProduct} />
        <ProductCard product={mockProductFeatured} />
        <ProductCard product={mockProductBestseller} />
      </div>
    ),
  ],
  render: () => <></>,
};
