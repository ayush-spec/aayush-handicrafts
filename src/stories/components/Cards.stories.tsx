import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    hover: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    padding: 'md',
    children: 'Card content goes here',
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const WithComposition: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle>Handcrafted Mug</CardTitle>
          <CardDescription>A beautifully made ceramic piece</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700">
            Each mug is individually crafted using traditional pottery techniques.
          </p>
        </CardContent>
        <CardFooter>
          <Button variant="primary" size="sm" fullWidth>
            Add to Cart
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

export const Hoverable: Story = {
  args: {
    hover: true,
    padding: 'md',
    children: 'Hover over me to see the border change',
  },
  decorators: [(Story) => <div className="w-80"><Story /></div>],
};

export const PaddingSizes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Card padding="sm"><p className="text-sm">Small padding (p-4)</p></Card>
      <Card padding="md"><p className="text-sm">Medium padding (p-6)</p></Card>
      <Card padding="lg"><p className="text-sm">Large padding (p-8)</p></Card>
      <Card padding="none"><p className="text-sm p-2">No padding</p></Card>
    </div>
  ),
};
