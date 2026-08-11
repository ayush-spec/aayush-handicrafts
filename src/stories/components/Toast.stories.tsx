import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Toast from '@/components/ui/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Toast>;

const noOp = () => {};

export const Success: Story = {
  args: {
    id: '1',
    message: 'Item added to cart!',
    type: 'success',
    duration: 999999,
    onClose: noOp,
  },
};

export const Error: Story = {
  args: {
    id: '2',
    message: 'Something went wrong. Please try again.',
    type: 'error',
    duration: 999999,
    onClose: noOp,
  },
};

export const Info: Story = {
  args: {
    id: '3',
    message: 'Your order is being processed.',
    type: 'info',
    duration: 999999,
    onClose: noOp,
  },
};

export const Warning: Story = {
  args: {
    id: '4',
    message: 'Only 2 items left in stock!',
    type: 'warning',
    duration: 999999,
    onClose: noOp,
  },
};

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-3 w-80">
      <Toast id="1" message="Item added to cart!" type="success" duration={999999} onClose={noOp} />
      <Toast id="2" message="Something went wrong." type="error" duration={999999} onClose={noOp} />
      <Toast id="3" message="Your order is being processed." type="info" duration={999999} onClose={noOp} />
      <Toast id="4" message="Only 2 items left!" type="warning" duration={999999} onClose={noOp} />
    </div>
  ),
};
