import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const Spacing = () => {
  const spacingScale = [
    { name: '1', px: 8, rem: 0.5, usage: 'Minimal spacing, icon gaps, card image to text' },
    { name: '2', px: 16, rem: 1, usage: 'Mobile container margins' },
    { name: '3', px: 24, rem: 1.5, usage: 'Product grid gaps, card padding' },
    { name: '4', px: 32, rem: 2, usage: 'Tablet container margins, grid gutters' },
    { name: '5', px: 40, rem: 2.5, usage: 'Section header spacing' },
    { name: '6', px: 48, rem: 3, usage: 'Desktop container margins, mobile section padding' },
    { name: '8', px: 64, rem: 4, usage: 'Tablet section padding' },
    { name: '10', px: 80, rem: 5, usage: 'Desktop section padding' },
    { name: '12', px: 96, rem: 6, usage: 'Large section gaps' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold font-serif mb-4">8pt Spacing System</h1>
      <p className="text-xl leading-relaxed text-gray-700 mb-12 max-w-3xl">
        All spacing follows a <strong>8-point base unit scale</strong> for mathematical precision.
        From 8px (minimal) to 96px (large gaps), every measurement is intentional and compact.
      </p>

      {/* Spacing Scale */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Spacing Scale</h2>

        <div className="space-y-4">
          {spacingScale.map((space) => (
            <div
              key={space.name}
              className="flex items-center gap-8 p-4 bg-gray-50 rounded-sm hover:bg-gray-100 transition-colors"
            >
              <div className="w-32">
                <p className="text-sm font-mono font-bold">{space.name}</p>
                <p className="text-xs text-gray-500">.p-{space.name}, .m-{space.name}</p>
              </div>
              <div className="w-32">
                <p className="text-sm font-mono"><strong>{space.px}px</strong></p>
                <p className="text-xs text-gray-500">{space.rem}rem</p>
              </div>
              <div
                className="h-8 bg-primary rounded-sm"
                style={{ width: `${space.px}px` }}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700">{space.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Spacing */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Section Spacing (Compact & Efficient)</h2>
        <p className="text-base text-gray-600 mb-8">
          Compact spacing for better content density. White space is intentional but not excessive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-900 text-white rounded-sm">
            <p className="text-xs uppercase tracking-wider font-medium text-gray-400 mb-2">
              DESKTOP
            </p>
            <p className="text-4xl font-bold mb-2">80px</p>
            <p className="text-sm text-gray-300">py-20 or h-20</p>
            <p className="text-xs text-gray-400 mt-4">
              Compact spacing for desktop screens
            </p>
          </div>

          <div className="p-6 bg-gray-700 text-white rounded-sm">
            <p className="text-xs uppercase tracking-wider font-medium text-gray-400 mb-2">
              TABLET
            </p>
            <p className="text-4xl font-bold mb-2">64px</p>
            <p className="text-sm text-gray-300">py-16 or h-16</p>
            <p className="text-xs text-gray-400 mt-4">
              Medium spacing for tablets
            </p>
          </div>

          <div className="p-6 bg-gray-500 text-white rounded-sm">
            <p className="text-xs uppercase tracking-wider font-medium text-gray-300 mb-2">
              MOBILE
            </p>
            <p className="text-4xl font-bold mb-2">48px</p>
            <p className="text-sm text-gray-300">py-12 or h-12</p>
            <p className="text-xs text-gray-300 mt-4">
              Compact for mobile screens
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
          <p className="text-sm font-mono">
            <strong>Pattern:</strong> className=&quot;py-12 md:py-16 lg:py-20&quot;
          </p>
        </div>
      </section>

      {/* Grid Gaps */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Grid Gaps</h2>

        <div className="space-y-8">
          <div className="bg-gray-50 p-6 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Product Grids</h3>
              <p className="text-sm font-mono text-gray-500">gap-6 (24px)</p>
            </div>
            <p className="text-base text-gray-700 mb-6">
              Compact spacing for better content density
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div className="aspect-square bg-secondary border-2 border-gray-300 rounded-sm" />
              <div className="aspect-square bg-secondary border-2 border-gray-300 rounded-sm" />
              <div className="aspect-square bg-secondary border-2 border-gray-300 rounded-sm" />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">12-Column Grid</h3>
              <p className="text-sm font-mono text-gray-500">gap-8 (32px)</p>
            </div>
            <p className="text-base text-gray-700 mb-6">
              Standard gutter for layout grid columns
            </p>
            <div className="grid grid-cols-6 gap-8">
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
              <div className="h-16 bg-primary/20 border-2 border-primary rounded-sm" />
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Content Elements</h3>
              <p className="text-sm font-mono text-gray-500">gap-4 to gap-6 (16-24px)</p>
            </div>
            <p className="text-base text-gray-700 mb-6">
              Moderate spacing for text blocks, form fields, list items
            </p>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded-sm" />
              <div className="h-12 bg-gray-200 rounded-sm" />
              <div className="h-12 bg-gray-200 rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      {/* Internal Component Spacing */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Internal Component Spacing</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-gray-50 rounded-sm">
            <h3 className="text-xl font-bold mb-4">Product Card (Compact)</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Image to content: <strong className="font-mono">mb-2 (8px)</strong></p>
              <p>• Name + Price: <strong className="font-mono">Single line, gap-2</strong></p>
              <p>• No category label (simplified)</p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-sm">
            <h3 className="text-xl font-bold mb-4">Section Headers</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Label to headline: <strong className="font-mono">mb-4 (16px)</strong></p>
              <p>• Headline to body: <strong className="font-mono">mb-6 (24px)</strong></p>
              <p>• Header to content: <strong className="font-mono">mb-10 (40px)</strong></p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-sm">
            <h3 className="text-xl font-bold mb-4">Buttons (Actual)</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• sm: <strong className="font-mono">px-2.5 py-1 (10px / 4px)</strong></p>
              <p>• md: <strong className="font-mono">px-3 py-1.5 (12px / 6px)</strong></p>
              <p>• lg: <strong className="font-mono">px-5 py-2.5 (20px / 10px)</strong></p>
              <p>• Between buttons: <strong className="font-mono">gap-4 to gap-6</strong></p>
              <p>• All buttons: <strong className="font-mono">uppercase tracking-wider</strong></p>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-sm">
            <h3 className="text-xl font-bold mb-4">Forms</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>• Input padding: <strong className="font-mono">px-4 py-2 (16px, 8px)</strong></p>
              <p>• Between fields: <strong className="font-mono">gap-4 (16px)</strong></p>
              <p>• Label to input: <strong className="font-mono">mb-1 (4px)</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section>
        <div className="p-8 bg-gray-900 text-white rounded-sm">
          <h3 className="text-2xl font-bold mb-4">Spacing Guidelines</h3>
          <ul className="space-y-3 text-base">
            <li>• <strong>Always use 8pt increments</strong>: 8, 16, 24, 32, 48, 64, 80px</li>
            <li>• <strong>Never arbitrary values</strong>: Use Tailwind scale (.p-2, .m-4, .gap-6, etc.)</li>
            <li>• <strong>Compact section spacing</strong>: 48px (py-12) on mobile, 80px (py-20) on desktop</li>
            <li>• <strong>Efficient product grids</strong>: 24px gaps (gap-6) for better density</li>
            <li>• <strong>Consistent responsive behavior</strong>: Desktop → Tablet → Mobile proportionally reduces</li>
            <li>• <strong>White space serves purpose</strong>: Use intentionally but don&apos;t waste screen space</li>
          </ul>

          <div className="mt-6 p-4 bg-white/10 rounded-sm">
            <p className="text-sm font-mono">
              <strong>Remember:</strong> Compact spacing improves content density without feeling cramped.
              Every gap should be intentional and serve the visual hierarchy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof Spacing> = {
  title: 'Design System/04 - Spacing',
  component: Spacing,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '8-point spacing system with dramatic white space following Swiss design principles.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spacing>;

export const EightPointSpacingSystem: Story = {};
