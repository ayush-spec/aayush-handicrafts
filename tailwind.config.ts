import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/stories/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '375px',      // iPhone SE, 12/13 mini
        'iphone': '393px',  // iPhone 14/15 Pro
        'iphone-max': '430px', // iPhone 14/15 Pro Max
      },
      spacing: {
        'safe': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        // 8pt base unit spacing scale (Swiss design)
        '1': '0.5rem',   // 8px
        '2': '1rem',     // 16px
        '3': '1.5rem',   // 24px
        '4': '2rem',     // 32px
        '5': '2.5rem',   // 40px
        '6': '3rem',     // 48px
        '8': '4rem',     // 64px
        '10': '5rem',    // 80px
        '12': '6rem',    // 96px
        '16': '8rem',    // 128px
        '20': '10rem',   // 160px
        '24': '12rem',   // 192px
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',      // Swiss design - minimal radius
        DEFAULT: '2px',   // Default to minimal
        'md': '2px',
        'lg': '2px',
        'xl': '2px',
        '2xl': '2px',
        '3xl': '2px',
        'full': '9999px', // Keep for dots/circles
      },
      colors: {
        // Brand palette — "Editorial Luxury / Jewel-Box Dark".
        // Swap here + globals.css to rebrand.
        primary: {
          DEFAULT: '#E8E9EB', // ivory-silver
          dark: '#C7CBD1',
        },
        secondary: '#171614', // elevated surface
        tertiary: {
          DEFAULT: '#A2A6AE', // muted silver
          dark: '#8B9099',
        },
        background: '#0F0E0D', // jewel-box near-black
        ivory: '#F4EFE6',
        accent: {
          purple: '#9BA3B4',
          green: '#6E857A',
        },
      },
      fontFamily: {
        sans: ['var(--font-gotham)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-maragsa)', 'Georgia', 'serif'],
      },
      keyframes: {
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
