import React from 'react';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const withToastProvider = (Story: React.ComponentType) => (
  <ToastProvider>
    <Story />
  </ToastProvider>
);
