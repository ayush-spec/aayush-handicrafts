import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalDemo = ({ content }: { content?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button variant="tertiary" onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-bold">Modal Title</h2>
          <p className="text-gray-700">
            {content || 'This is a modal rendered via createPortal at z-[70]. It locks body scroll and traps focus.'}
          </p>
          <Button variant="primary" size="sm" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
};

export const Default: Story = {
  render: () => <ModalDemo />,
};

export const WithScrollContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button variant="tertiary" onClick={() => setIsOpen(true)}>
          Open Scrollable Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold">Scrollable Content</h2>
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-gray-700">
                Paragraph {i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            ))}
          </div>
        </Modal>
      </>
    );
  },
};
