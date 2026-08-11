import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: { control: 'boolean' },
    isLoading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Add to Cart',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Browse Collection',
    variant: 'secondary',
    size: 'md',
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Shop Now',
    variant: 'tertiary',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    children: 'View Details',
    variant: 'outline',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Learn More',
    variant: 'ghost',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    children: 'Subscribe',
    variant: 'primary',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Shop Collection',
    variant: 'tertiary',
    size: 'lg',
  },
};

export const Loading: Story = {
  args: {
    children: 'Adding...',
    variant: 'primary',
    size: 'md',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Out of Stock',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Add to Cart',
    variant: 'primary',
    size: 'md',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export const AsLink: Story = {
  args: {
    children: 'Go to Shop',
    variant: 'tertiary',
    size: 'md',
    href: '/shop',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4 items-end">
      <Button variant="tertiary" size="sm">Small</Button>
      <Button variant="tertiary" size="md">Medium</Button>
      <Button variant="tertiary" size="lg">Large</Button>
    </div>
  ),
};
