import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChevronLeft, Heart, ShoppingCart } from 'lucide-react';

const MobileGuidelinesComponent = () => {
  return <div>Mobile Design Guidelines</div>;
};

const meta: Meta<typeof MobileGuidelinesComponent> = {
  title: 'Design System/Mobile Guidelines',
  component: MobileGuidelinesComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Comprehensive mobile design guidelines for iPhone optimization, including viewport specifications, safe areas, touch targets, and responsive typography.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MobileGuidelinesComponent>;

export const iPhoneViewports: Story = {
  render: () => {
    // Read design tokens from CSS variables
    const getToken = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    return (
      <div className="p-8 max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold font-serif mb-8">iPhone Viewports</h1>

        <div className="p-6 bg-gray-50 border-l-4 border-gray-400 rounded-sm mb-6">
          <p className="text-sm text-gray-700">
            <strong>📍 Design Tokens:</strong> All values below are read from CSS variables in <code className="bg-white px-2 py-1 rounded font-mono text-xs">globals.css</code>.
            When you update the CSS variables, this documentation automatically updates.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
            <h3 className="text-2xl font-bold mb-2">iPhone 15 Pro (Primary)</h3>
            <p className="text-xl font-mono font-bold text-primary mb-3">
              {getToken('--viewport-iphone15pro-width')} × {getToken('--viewport-iphone15pro-height')}
            </p>
            <p className="text-base text-gray-700">
              Standard Pro model with Dynamic Island. This is the primary mobile viewport for all Storybook mobile stories.
              Optimal for most designs and represents the most common premium iPhone size.
            </p>
          </div>

        <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded-sm">
          <h3 className="text-xl font-bold mb-2">iPhone 15 Pro Max</h3>
          <p className="text-lg font-mono font-bold text-gray-700 mb-3">
            {getToken('--viewport-iphone15promax-width')} × {getToken('--viewport-iphone15promax-height')}
          </p>
          <p className="text-base text-gray-700">
            Largest screen size. Test for edge cases and ensure layouts don&apos;t look stretched. Use for testing max-width constraints.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded-sm">
          <h3 className="text-xl font-bold mb-2">iPhone 15</h3>
          <p className="text-lg font-mono font-bold text-gray-700 mb-3">
            {getToken('--viewport-iphone15-width')} × {getToken('--viewport-iphone15-height')}
          </p>
          <p className="text-base text-gray-700">
            Base model, similar to Pro but slightly narrower. Good for testing responsive behavior near the {getToken('--breakpoint-iphone15pro')} breakpoint.
          </p>
        </div>

        <div className="p-6 bg-gray-50 border-l-4 border-gray-300 rounded-sm">
          <h3 className="text-xl font-bold mb-2">Mobile (Legacy)</h3>
          <p className="text-lg font-mono font-bold text-gray-700 mb-3">
            {getToken('--viewport-mobile-legacy-width')} × {getToken('--viewport-mobile-legacy-height')}
          </p>
          <p className="text-base text-gray-700">
            Older iPhone sizes (iPhone 6/7/8/SE). Use only for testing backward compatibility with smaller screens.
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-sm">
        <h3 className="text-xl font-bold mb-4">Why iPhone 15 Pro?</h3>
        <ul className="space-y-2 text-base">
          <li>✓ Most common premium device in 2024-2026</li>
          <li>✓ Dynamic Island requires safe area consideration</li>
          <li>✓ {getToken('--viewport-iphone15pro-width')} width provides better canvas than legacy {getToken('--viewport-mobile-legacy-width')}</li>
          <li>✓ Tall aspect ratio ({getToken('--viewport-iphone15pro-height')}) tests vertical scroll experiences</li>
          <li>✓ Representative of modern iPhone dimensions</li>
        </ul>
      </div>
    </div>
    );
  },
};

export const SafeAreas: Story = {
  render: () => {
    const getToken = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    return (
      <div className="p-8 max-w-4xl space-y-8">
        <h1 className="text-5xl font-bold font-serif mb-8">Safe Area Guidelines</h1>

        <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
          <h3 className="text-2xl font-bold mb-3">What are Safe Areas?</h3>
          <p className="text-base text-gray-700 mb-4">
            Safe areas are regions of the screen that are guaranteed not to be obscured by device hardware like the Dynamic Island,
            status bar, or home indicator. iOS provides environment variables for these insets.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white rounded-sm">
              <p className="text-sm font-bold mb-2">Top Safe Area</p>
              <p className="text-xs text-gray-600 font-mono">{getToken('--safe-area-top-approximate')} (Dynamic Island + status bar)</p>
            </div>
            <div className="p-4 bg-white rounded-sm">
              <p className="text-sm font-bold mb-2">Bottom Safe Area</p>
              <p className="text-xs text-gray-600 font-mono">{getToken('--safe-area-bottom-approximate')} (home indicator)</p>
            </div>
          </div>
        </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-serif">Safe Area Utilities</h2>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.pt-safe</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">padding-top: env(safe-area-inset-top)</p>
          <p className="text-base text-gray-700 mb-3">
            Use for sticky headers and top fixed elements. Adds padding equal to the Dynamic Island + status bar height.
          </p>
          <div className="bg-white p-4 rounded-sm border-2 border-gray-200">
            <code className="text-sm">
              {'<header className="sticky top-0 bg-white pt-safe">'}
            </code>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.pb-safe</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">padding-bottom: env(safe-area-inset-bottom)</p>
          <p className="text-base text-gray-700 mb-3">
            Use for fixed footers, bottom navigation, and CTAs. Adds padding equal to the home indicator height.
          </p>
          <div className="bg-white p-4 rounded-sm border-2 border-gray-200">
            <code className="text-sm">
              {'<div className="fixed bottom-0 pb-safe">'}
            </code>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.py-safe</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">padding-top/bottom: env(safe-area-inset-*)</p>
          <p className="text-base text-gray-700 mb-3">
            Combines top and bottom safe areas. Use for full-screen modals or overlays.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.safe-area</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">padding: env(safe-area-inset-*) (all sides)</p>
          <p className="text-base text-gray-700 mb-3">
            Full safe area padding on all sides. Use for full-screen views with fixed elements.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.top-safe / .bottom-safe</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">top/bottom: env(safe-area-inset-*)</p>
          <p className="text-base text-gray-700 mb-3">
            Positioning utilities for absolutely positioned elements. Use with fixed or absolute positioning.
          </p>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-3">.min-h-screen-safe</h3>
          <p className="text-sm text-gray-600 mb-2 font-mono">min-height: calc(100vh - safe areas)</p>
          <p className="text-base text-gray-700 mb-3">
            Minimum height accounting for safe areas. Use for full-screen layouts that respect safe areas.
          </p>
        </div>
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-sm">
        <h3 className="text-xl font-bold mb-3">When to Use Safe Areas</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ <strong>Sticky headers:</strong> Always use .pt-safe</li>
          <li>✓ <strong>Fixed footers/CTAs:</strong> Always use .pb-safe</li>
          <li>✓ <strong>Full-screen modals:</strong> Use .safe-area or .py-safe</li>
          <li>✓ <strong>Bottom navigation:</strong> Use .pb-safe</li>
          <li>❌ <strong>Scrollable content:</strong> Don&apos;t need safe areas (handled by viewport)</li>
          <li>❌ <strong>Desktop views:</strong> Safe areas have no effect</li>
        </ul>
      </div>
    </div>
    );
  },
};

export const SafeAreaDemo: Story = {
  render: () => (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky header with safe area */}
      <header className="sticky top-0 bg-white shadow-sm pt-safe z-50">
        <div className="h-14 px-5 flex items-center justify-between">
          <button className="p-2.5 -ml-2.5">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-lg">Safe Area Demo</h1>
          <button className="p-2.5 -mr-2.5">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-5 min-h-[600px] space-y-6">
        <div className="p-6 bg-white rounded-sm shadow-sm">
          <h2 className="text-2xl font-bold font-serif mb-3">Header with .pt-safe</h2>
          <p className="text-base text-gray-700">
            The header above has <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">pt-safe</code> class,
            which adds padding equal to the Dynamic Island + status bar height (~59px on iPhone 15 Pro).
          </p>
        </div>

        <div className="p-6 bg-white rounded-sm shadow-sm">
          <h2 className="text-2xl font-bold font-serif mb-3">Scrollable Content</h2>
          <p className="text-base text-gray-700 mb-4">
            This content area scrolls normally and doesn&apos;t need safe area utilities because it&apos;s not fixed.
          </p>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-sm">
                <p className="text-sm text-gray-600">Content block {i + 1}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white rounded-sm shadow-sm mb-32">
          <h2 className="text-2xl font-bold font-serif mb-3">Footer with .pb-safe</h2>
          <p className="text-base text-gray-700">
            The fixed footer below has <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">pb-safe</code> class,
            which adds padding equal to the home indicator height (~34px on iPhone 15 Pro).
          </p>
        </div>
      </div>

      {/* Fixed footer with safe area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
        <div className="p-5">
          <button className="w-full h-14 bg-primary text-white rounded-sm font-bold uppercase flex items-center justify-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'iphone15Pro',
    },
  },
};

export const TouchTargets: Story = {
  render: () => (
    <div className="p-8 max-w-4xl space-y-8">
      <h1 className="text-5xl font-bold font-serif mb-8">Touch Target Guidelines</h1>

      <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
        <h3 className="text-2xl font-bold mb-3">iOS Touch Target Standards</h3>
        <p className="text-base text-gray-700">
          Apple&apos;s Human Interface Guidelines recommend a <strong>minimum touch target size of 44×44 points</strong> (44×44px on standard displays).
          This ensures comfortable tapping for all users, including those with motor impairments.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-4">Minimum Sizes</h3>
          <ul className="space-y-3 text-sm font-mono">
            <li className="flex items-center gap-2">
              <span className="w-11 h-11 bg-red-100 border-2 border-red-500 rounded-sm inline-flex items-center justify-center text-xs">
                40px
              </span>
              <span className="text-gray-700">❌ Too small</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-11 h-11 bg-green-100 border-2 border-green-500 rounded-sm inline-flex items-center justify-center text-xs">
                44px
              </span>
              <span className="text-gray-700">✓ Minimum (iOS standard)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-12 h-12 bg-green-100 border-2 border-green-500 rounded-sm inline-flex items-center justify-center text-xs">
                48px
              </span>
              <span className="text-gray-700">✓ Comfortable (recommended)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-14 h-14 bg-green-100 border-2 border-green-500 rounded-sm inline-flex items-center justify-center text-xs">
                56px
              </span>
              <span className="text-gray-700">✓ Large (primary CTAs)</span>
            </li>
          </ul>
        </div>

        <div className="p-6 bg-gray-50 rounded-sm">
          <h3 className="text-xl font-bold mb-4">Spacing Between Targets</h3>
          <ul className="space-y-3 text-sm">
            <li>• <strong>Minimum gap:</strong> 8px between touch targets</li>
            <li>• <strong>Comfortable gap:</strong> 12-16px for better UX</li>
            <li>• <strong>Adjacent buttons:</strong> 16px+ gap recommended</li>
            <li>• <strong>Icon grids:</strong> 8-12px gap is acceptable</li>
          </ul>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-serif">Common Touch Targets</h2>

        <div className="grid gap-6">
          <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
            <h3 className="text-lg font-bold mb-3">Header Icons</h3>
            <div className="flex items-center gap-4 mb-3">
              <button className="p-2.5 hover:bg-gray-100 rounded-sm">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-sm">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2.5 hover:bg-gray-100 rounded-sm">
                <ShoppingCart className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono">
              Icon: 20px, Padding: 10px (p-2.5), Total: 40px + 8px gap = <strong>48px touch target</strong> ✓
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
            <h3 className="text-lg font-bold mb-3">Primary Button</h3>
            <button className="w-full h-14 bg-primary text-white rounded-sm font-bold uppercase">
              Add to Cart
            </button>
            <p className="text-sm text-gray-600 font-mono mt-3">
              Height: 56px (h-14), Full-width, <strong>56×full touch target</strong> ✓
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
            <h3 className="text-lg font-bold mb-3">Quantity Selector</h3>
            <div className="flex items-center justify-center gap-4">
              <button className="w-12 h-12 border-2 border-gray-300 rounded-sm font-bold">−</button>
              <span className="w-12 h-12 border-2 border-gray-300 rounded-sm flex items-center justify-center font-bold">1</span>
              <button className="w-12 h-12 border-2 border-gray-300 rounded-sm font-bold">+</button>
            </div>
            <p className="text-sm text-gray-600 font-mono mt-3">
              Button: 48×48px (w-12 h-12), Gap: 16px, <strong>48px touch target</strong> ✓
            </p>
          </div>

          <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
            <h3 className="text-lg font-bold mb-3">Image Thumbnails</h3>
            <div className="flex gap-2">
              <button className="w-12 h-12 border-2 border-primary rounded-sm overflow-hidden">
                <div className="w-full h-full bg-gray-200" />
              </button>
              <button className="w-12 h-12 border-2 border-gray-200 rounded-sm overflow-hidden">
                <div className="w-full h-full bg-gray-200" />
              </button>
              <button className="w-12 h-12 border-2 border-gray-200 rounded-sm overflow-hidden">
                <div className="w-full h-full bg-gray-200" />
              </button>
            </div>
            <p className="text-sm text-gray-600 font-mono mt-3">
              Thumbnail: 48×48px (w-12 h-12), Gap: 8px, <strong>48px touch target</strong> ✓
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-sm">
        <h3 className="text-xl font-bold mb-3">Touch Target Checklist</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ All interactive elements are <strong>at least 44×44px</strong></li>
          <li>✓ Primary CTAs use <strong>48-56px height</strong> for comfort</li>
          <li>✓ Icons have <strong>padding</strong> to reach 44px+ total size</li>
          <li>✓ Adjacent buttons have <strong>8px+ gap</strong> between them</li>
          <li>✓ Small thumbnails are <strong>48px+</strong> for tapping</li>
          <li>✓ Links in body text are <strong>underlined</strong> and have generous line-height</li>
        </ul>
      </div>
    </div>
  ),
};

export const ResponsiveTypography: Story = {
  render: () => (
    <div className="p-8 max-w-4xl space-y-8">
      <h1 className="text-5xl font-bold font-serif mb-8">Responsive Typography</h1>

      <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
        <h3 className="text-2xl font-bold mb-3">Mobile-First Typography</h3>
        <p className="text-base text-gray-700">
          All typography classes now scale responsively from mobile to desktop. Mobile sizes (393px) are the base,
          with larger sizes applied at md: (768px) and lg: (1280px) breakpoints.
        </p>
      </div>

      <div className="space-y-8">
        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-h1 - Hero Headline</p>
          <h1 className="type-h1 mb-3">Mud Monkey Studio</h1>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>48px / 56px</strong></p>
            <p>Tablet (md): <strong>72px / 80px</strong></p>
            <p>Desktop (lg): <strong>96px / 104px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-h2 - Section Headline</p>
          <h2 className="type-h2 mb-3">Customer Favorites</h2>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>40px / 48px</strong></p>
            <p>Tablet (md): <strong>56px / 64px</strong></p>
            <p>Desktop (lg): <strong>64px / 72px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-h3 - Sub-section Headline</p>
          <h3 className="type-h3 mb-3">Fresh from the Kiln</h3>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>32px / 40px</strong></p>
            <p>Tablet (md): <strong>40px / 48px</strong></p>
            <p>Desktop (lg): <strong>48px / 56px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-h4 - Card Headline</p>
          <h4 className="type-h4 mb-3">Handcrafted Mug</h4>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>24px / 32px</strong></p>
            <p>Tablet (md): <strong>28px / 36px</strong></p>
            <p>Desktop (lg): <strong>32px / 40px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-body-lg - Large Body Text</p>
          <p className="type-body-lg mb-3">
            Delightfully quirky clayware that brings joy to your everyday moments.
          </p>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>18px / 28px</strong></p>
            <p>Tablet (md): <strong>20px / 32px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-body - Body Text</p>
          <p className="type-body mb-3">
            Each piece is meticulously handcrafted using traditional pottery techniques passed down through generations.
          </p>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>15px / 24px</strong></p>
            <p>Tablet (md): <strong>16px / 26px</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-label - Labels (no scaling)</p>
          <p className="type-label mb-3">BESTSELLERS</p>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>All sizes: <strong>12px / 16px / +8% tracking / UPPERCASE</strong></p>
          </div>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <p className="text-xs text-gray-500 mb-2">.type-price - Price</p>
          <p className="type-price mb-3 text-primary">₹1,299</p>
          <div className="text-sm text-gray-600 font-mono space-y-1">
            <p>Mobile: <strong>24px / 32px</strong></p>
            <p>Tablet (md): <strong>28px / 36px</strong></p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-sm">
        <h3 className="text-xl font-bold mb-3">Typography Best Practices</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Use <strong>.type-* classes</strong> for consistent responsive scaling</li>
          <li>✓ Mobile headlines are <strong>50-60% smaller</strong> than desktop</li>
          <li>✓ Body text scales <strong>minimally</strong> (15→16px) for readability</li>
          <li>✓ Labels and small text <strong>don&apos;t scale</strong> - stay consistent</li>
          <li>✓ Line-height increases with font size for proper rhythm</li>
          <li>✓ Tracking (letter-spacing) is negative for large headlines, positive for small text</li>
        </ul>
      </div>
    </div>
  ),
};

export const MobileSpacing: Story = {
  render: () => (
    <div className="p-8 max-w-4xl space-y-8">
      <h1 className="text-5xl font-bold font-serif mb-8">Mobile Spacing Patterns</h1>

      <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
        <h3 className="text-2xl font-bold mb-3">Container Padding</h3>
        <p className="text-base text-gray-700 mb-4">
          The <code className="bg-white px-2 py-1 rounded font-mono text-sm">.container-swiss</code> utility now uses responsive padding:
        </p>
        <ul className="space-y-2 text-sm font-mono bg-white p-4 rounded-sm">
          <li>Mobile ({'<393px'}): <strong>16px (1rem)</strong></li>
          <li>iPhone 15 Pro (≥393px): <strong>20px (1.25rem)</strong></li>
          <li>Tablet (≥768px): <strong>32px (2rem)</strong></li>
          <li>Desktop (≥1280px): <strong>48px (3rem)</strong></li>
        </ul>
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold font-serif">Section Spacing</h2>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <h3 className="text-lg font-bold mb-3">Vertical Section Padding</h3>
          <ul className="space-y-2 text-sm">
            <li>• Mobile: <strong>py-12</strong> (48px top/bottom)</li>
            <li>• Tablet: <strong>md:py-16</strong> (64px)</li>
            <li>• Desktop: <strong>lg:py-20</strong> (80px)</li>
          </ul>
          <p className="text-sm text-gray-600 mt-3">
            Use <code className="bg-gray-100 px-2 py-1 rounded font-mono">.section-spacing</code> for automatic responsive section padding.
          </p>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <h3 className="text-lg font-bold mb-3">Section Gaps</h3>
          <ul className="space-y-2 text-sm">
            <li>• Mobile: <strong>h-12</strong> (48px gap between sections)</li>
            <li>• Tablet: <strong>md:h-16</strong> (64px)</li>
            <li>• Desktop: <strong>lg:h-20</strong> (80px)</li>
          </ul>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <h3 className="text-lg font-bold mb-3">Content Spacing</h3>
          <ul className="space-y-2 text-sm">
            <li>• Between heading and body: <strong>space-y-4</strong> (16px)</li>
            <li>• Between body paragraphs: <strong>space-y-6</strong> (24px)</li>
            <li>• Between sections: <strong>space-y-8</strong> (32px)</li>
            <li>• Product cards gap: <strong>gap-4</strong> or <strong>gap-6</strong></li>
          </ul>
        </div>

        <div className="p-6 bg-white border-2 border-gray-200 rounded-sm">
          <h3 className="text-lg font-bold mb-3">Mobile Product Card Spacing</h3>
          <ul className="space-y-2 text-sm">
            <li>• Card content padding: <strong>p-2.5</strong> (10px)</li>
            <li>• Image: <strong>flex-1</strong> (takes most of card height)</li>
            <li>• Category: <strong>text-[10px]</strong> uppercase tracking-wider</li>
            <li>• Title: <strong>text-base</strong> font-medium line-clamp-2</li>
            <li>• Price: <strong>text-lg</strong> font-medium text-primary</li>
            <li>• Card container: max-w-sm (384px), height 540px</li>
          </ul>
        </div>
      </div>

      <div className="p-6 bg-gray-900 text-white rounded-sm">
        <h3 className="text-xl font-bold mb-3">Mobile Spacing Principles</h3>
        <ul className="space-y-2 text-sm">
          <li>✓ Use <strong>20px (px-5)</strong> horizontal padding on iPhone 15 Pro</li>
          <li>✓ Reduce section padding by <strong>~40%</strong> on mobile vs desktop</li>
          <li>✓ Maintain <strong>8px minimum gap</strong> between interactive elements</li>
          <li>✓ Use <strong>space-y-*</strong> utilities for vertical rhythm</li>
          <li>✓ Product grids use <strong>gap-4</strong> (16px) on mobile for density</li>
          <li>✓ Increase whitespace as screen size grows</li>
        </ul>
      </div>
    </div>
  ),
};
