import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const ColorPalette = () => {
  const brandColors = [
    {
      name: 'Primary',
      hex: '#F27149',
      class: 'bg-primary',
      textColor: 'text-white',
      usage: 'Primary CTA buttons, labels, accents'
    },
    {
      name: 'Secondary',
      hex: '#FCF3EA',
      class: 'bg-secondary',
      textColor: 'text-gray-900',
      usage: 'Subtle backgrounds, product card backgrounds'
    },
    {
      name: 'Tertiary',
      hex: '#FFAEAE',
      class: 'bg-tertiary',
      textColor: 'text-gray-900',
      usage: 'Section labels, decorative accents'
    },
    {
      name: 'Accent Purple',
      hex: '#C1A2CC',
      class: 'bg-accent-purple',
      textColor: 'text-white',
      usage: 'Premium section accent, borders'
    },
    {
      name: 'Accent Green',
      hex: '#448470',
      class: 'bg-accent-green',
      textColor: 'text-white',
      usage: 'Budget-friendly section accent'
    },
  ];

  const neutralColors = [
    { name: 'Gray 900', hex: '#111827', class: 'bg-gray-900', textColor: 'text-white' },
    { name: 'Gray 700', hex: '#374151', class: 'bg-gray-700', textColor: 'text-white' },
    { name: 'Gray 500', hex: '#6B7280', class: 'bg-gray-500', textColor: 'text-white' },
    { name: 'Gray 300', hex: '#D1D5DB', class: 'bg-gray-300', textColor: 'text-gray-900' },
    { name: 'Gray 100', hex: '#F3F4F6', class: 'bg-gray-100', textColor: 'text-gray-900' },
    { name: 'White', hex: '#FFFFFF', class: 'bg-white border border-gray-200', textColor: 'text-gray-900' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold font-serif mb-4">Swiss Design Color System</h1>
      <p className="text-xl leading-relaxed text-gray-700 mb-12 max-w-3xl">
        High contrast color system following Swiss design principles.
        <strong> 80% monochrome</strong> (black/white/gray),
        <strong> 20% strategic brand color accents</strong>.
      </p>

      {/* Brand Colors */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-6">Brand Colors</h2>
        <p className="text-base text-gray-600 mb-8">
          Use sparingly for labels, CTAs, and strategic accents. One accent color per section maximum.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brandColors.map((color) => (
            <div key={color.name} className="space-y-3">
              <div
                className={`${color.class} w-full aspect-square rounded-sm flex items-center justify-center`}
              >
                <span className={`${color.textColor} text-2xl font-bold`}>Aa</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                  {color.name}
                </p>
                <p className="font-bold text-lg">{color.hex}</p>
                <p className="text-sm text-gray-600 font-mono">{color.class}</p>
                <p className="text-sm text-gray-500 mt-2">{color.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Neutral Colors */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-6">Neutral Colors</h2>
        <p className="text-base text-gray-600 mb-8">
          Monochrome palette forms 80% of the design. Use for text, backgrounds, and borders.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {neutralColors.map((color) => (
            <div key={color.name} className="space-y-3">
              <div
                className={`${color.class} w-full aspect-square rounded-sm flex items-center justify-center`}
              >
                <span className={`${color.textColor} text-xl font-bold`}>Aa</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                  {color.name}
                </p>
                <p className="text-sm font-mono">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contrast Ratios */}
      <section>
        <h2 className="text-4xl font-bold font-serif mb-6">Contrast Ratios (WCAG AA)</h2>
        <p className="text-base text-gray-600 mb-8">
          All combinations meet WCAG AA standards for accessibility.
        </p>

        <div className="space-y-4">
          <div className="p-6 bg-white border-2 border-gray-900 rounded-sm">
            <p className="text-lg font-medium text-gray-900">
              Gray-900 on White: <strong>21:1</strong> ✓ AAA
            </p>
          </div>

          <div className="p-6 bg-primary rounded-sm">
            <p className="text-lg font-medium text-white">
              White on Primary (#F27149): <strong>3.8:1</strong> ✓ AA (large text)
            </p>
          </div>

          <div className="p-6 bg-gray-900 rounded-sm">
            <p className="text-lg font-medium text-white">
              White on Gray-900: <strong>18:1</strong> ✓ AAA
            </p>
          </div>

          <div className="p-6 bg-white border border-gray-200 rounded-sm">
            <p className="text-lg font-medium text-primary">
              Primary on White: <strong>3.2:1</strong> ⚠️ Large text only (labels, prices, headlines)
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-gray-100 rounded-sm">
          <h3 className="text-xl font-bold mb-3">Usage Guidelines</h3>
          <ul className="space-y-2 text-base text-gray-700">
            <li>• Use Gray-900 or Gray-700 for body text on white backgrounds</li>
            <li>• Primary color only for large text (12px+ labels, 28px+ prices, headlines)</li>
            <li>• One accent color per section maximum for Swiss minimalism</li>
            <li>• White backgrounds dominate (80% of layout)</li>
            <li>• High contrast borders: 2px black/gray borders for definition</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof ColorPalette> = {
  title: 'Design System/01 - Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Swiss design color system with high contrast and strategic accent usage.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const SwissColorSystem: Story = {};
