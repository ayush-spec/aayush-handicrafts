import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import FilterModal from '@/components/product/FilterModal';
import Button from '@/components/ui/Button';
import { mockCategories } from '../_mocks';

const meta: Meta<typeof FilterModal> = {
  title: 'Components/FilterModal',
  component: FilterModal,
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof FilterModal>;

const FilterModalDemo = () => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="p-4">
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
        Open Filters
      </Button>
      <FilterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        categories={mockCategories}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <FilterModalDemo />,
};
