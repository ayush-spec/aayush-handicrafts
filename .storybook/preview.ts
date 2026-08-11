import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'
import './storybook-fonts.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'white',
      values: [
        { name: 'white', value: '#ffffff' },
        { name: 'cream', value: '#FCF3EA' },
        { name: 'gray', value: '#f5f5f5' },
        { name: 'dark', value: '#111827' },
      ],
    },
    viewport: {
      viewports: {
        iphone15Pro: {
          name: 'iPhone 15 Pro',
          styles: {
            width: '393px',
            height: '852px',
          },
          type: 'mobile',
        },
        iphone15ProMax: {
          name: 'iPhone 15 Pro Max',
          styles: {
            width: '430px',
            height: '932px',
          },
          type: 'mobile',
        },
        iphone15: {
          name: 'iPhone 15',
          styles: {
            width: '390px',
            height: '844px',
          },
          type: 'mobile',
        },
        mobile: {
          name: 'Mobile (Legacy)',
          styles: {
            width: '375px',
            height: '667px',
          },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1440px', height: '900px' },
        },
      },
      defaultViewport: 'iphone15Pro',
    },
    a11y: {
      test: 'todo'
    }
  },
};

export default preview;