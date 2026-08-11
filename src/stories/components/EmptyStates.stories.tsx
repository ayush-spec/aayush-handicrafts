import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EmptyState, {
  EmptyCart,
  EmptySearch,
  EmptyProducts,
  EmptyFavorites,
  ErrorState,
} from '@/components/ui/EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
  decorators: [(Story) => <div className="w-96"><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: 'Nothing here yet',
    description: 'This area is empty. Start by adding some items.',
    actionLabel: 'Get Started',
    actionHref: '/shop',
  },
};

export const Cart: Story = {
  render: () => <EmptyCart />,
};

export const Search: Story = {
  render: () => <EmptySearch />,
};

export const Products: Story = {
  render: () => <EmptyProducts />,
};

export const Favorites: Story = {
  render: () => <EmptyFavorites />,
};

export const ErrorWithRetry: Story = {
  render: () => <ErrorState message="Failed to load products." onRetry={() => alert('Retrying...')} />,
};

export const ErrorDefault: Story = {
  render: () => <ErrorState />,
};
