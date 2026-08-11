import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const GridSystem = () => {
  return (
    <div className="p-8">
      <h1 className="text-6xl font-bold font-serif mb-4">12-Column Swiss Grid System</h1>
      <p className="text-xl leading-relaxed text-gray-700 mb-12 max-w-3xl">
        Precise mathematical grid with <strong>32px gutters</strong>, <strong>48px margins</strong> (desktop),
        following <strong>8pt base unit scale</strong>. All layouts follow strict grid alignment with compact spacing.
      </p>

      {/* Grid Specifications */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-6">Grid Specifications</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="p-6 bg-gray-100 rounded-sm">
            <h3 className="text-xl font-bold mb-3">Desktop (1280px+)</h3>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li>• Max Width: <strong>1440px</strong></li>
              <li>• Columns: <strong>12</strong></li>
              <li>• Gutter: <strong>32px (2rem)</strong></li>
              <li>• Margins: <strong>48px (3rem)</strong></li>
              <li>• Base Unit: <strong>8px</strong></li>
            </ul>
          </div>

          <div className="p-6 bg-gray-100 rounded-sm">
            <h3 className="text-xl font-bold mb-3">Tablet (768-1279px)</h3>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li>• Max Width: <strong>100%</strong></li>
              <li>• Columns: <strong>12</strong></li>
              <li>• Gutter: <strong>24px (1.5rem)</strong></li>
              <li>• Margins: <strong>32px (2rem)</strong></li>
              <li>• Base Unit: <strong>8px</strong></li>
            </ul>
          </div>

          <div className="p-6 bg-gray-100 rounded-sm">
            <h3 className="text-xl font-bold mb-3">Mobile (375-767px)</h3>
            <ul className="space-y-2 text-sm text-gray-700 font-mono">
              <li>• Max Width: <strong>100%</strong></li>
              <li>• Columns: <strong>4</strong></li>
              <li>• Gutter: <strong>16px (1rem)</strong></li>
              <li>• Margins: <strong>16px (1rem)</strong></li>
              <li>• Base Unit: <strong>8px</strong></li>
            </ul>
          </div>
        </div>

        <div className="p-6 bg-primary/10 border-l-4 border-primary rounded-sm">
          <p className="text-sm font-mono text-gray-800">
            <strong>CSS Class:</strong> .container-swiss (max-width: 1440px with responsive padding)
          </p>
        </div>
      </section>

      {/* 12-Column Grid Visualization */}
      <section className="mb-16 bg-gray-50 p-8 rounded-sm">
        <h2 className="text-4xl font-bold font-serif mb-8">12-Column Grid</h2>
        <div className="container-swiss">
          <div className="grid grid-cols-12 gap-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-primary/20 border-2 border-primary p-4 text-center rounded-sm"
              >
                <span className="text-xs font-bold text-primary">{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 font-mono">
          grid grid-cols-12 gap-8
        </p>
      </section>

      {/* Asymmetric Layouts */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Asymmetric Layouts</h2>
        <p className="text-base text-gray-600 mb-8">
          Swiss design uses asymmetric layouts to create visual tension and hierarchy.
        </p>

        <div className="space-y-12">
          {/* 7-5 Split */}
          <div className="bg-gray-50 p-8 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                7-5 SPLIT (HERO SECTION)
              </p>
              <p className="text-sm font-mono text-gray-500">col-span-7 + col-span-5</p>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-7 bg-primary/20 border-2 border-primary p-8 rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-primary mb-2">
                  7 COLUMNS - MAIN CONTENT
                </p>
                <p className="text-sm text-gray-700">
                  Label + Headline + Subtitle + CTA
                </p>
              </div>
              <div className="col-span-12 lg:col-span-5 bg-secondary border-2 border-gray-300 p-8 rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-gray-600 mb-2">
                  5 COLUMNS - SECONDARY
                </p>
                <p className="text-sm text-gray-700">
                  Logo watermark or white space
                </p>
              </div>
            </div>
          </div>

          {/* 5-7 Split */}
          <div className="bg-gray-50 p-8 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                5-7 SPLIT (INFO SECTION)
              </p>
              <p className="text-sm font-mono text-gray-500">col-span-5 + col-span-7</p>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-5 bg-secondary border-2 border-gray-300 aspect-[3/4] flex items-center justify-center rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-gray-600">
                  IMAGE
                </p>
              </div>
              <div className="col-span-12 lg:col-span-7 bg-primary/20 border-2 border-primary p-8 rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-primary mb-2">
                  7 COLUMNS - CONTENT
                </p>
                <p className="text-sm text-gray-700">
                  Label + Headline + Body + List + CTAs
                </p>
              </div>
            </div>
          </div>

          {/* 6-6 Split */}
          <div className="bg-gray-50 p-8 rounded-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                6-6 SPLIT (NEWSLETTER)
              </p>
              <p className="text-sm font-mono text-gray-500">col-span-6 + col-span-6</p>
            </div>
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-6 bg-primary/20 border-2 border-primary p-8 rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-primary mb-2">
                  6 COLUMNS - HEADLINE
                </p>
                <p className="text-sm text-gray-700">
                  Label + H2 + Body text
                </p>
              </div>
              <div className="col-span-12 lg:col-span-6 bg-secondary border-2 border-gray-300 p-8 rounded-sm">
                <p className="text-xs uppercase tracking-wider font-medium text-gray-600 mb-2">
                  6 COLUMNS - FORM
                </p>
                <p className="text-sm text-gray-700">
                  Input + Button + Privacy text
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grids */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold font-serif mb-8">Product Grids</h2>
        <p className="text-base text-gray-600 mb-8">
          Desktop uses masonry-style grids. Mobile uses a scroll-driven card stack animation (not a grid).
        </p>

        <div className="space-y-12">
          {/* Bestsellers Grid */}
          <div className="bg-gray-50 p-8 rounded-sm">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                BESTSELLERS GRID
              </p>
              <p className="text-sm font-mono text-gray-500">
                gap-[2px] md:gap-1 | Desktop: 4 cols, Mobile: 2 cols
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-[2px] md:gap-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-secondary border-2 border-gray-300 rounded-sm flex items-center justify-center"
                >
                  <span className="text-sm font-medium text-gray-600">Product {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Shop Grid */}
          <div className="bg-gray-50 p-8 rounded-sm">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider font-medium text-gray-500">
                DESKTOP SHOP GRID
              </p>
              <p className="text-sm font-mono text-gray-500">
                gap-6 (24px) | Desktop: masonry columns
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/3.7] bg-secondary border-2 border-gray-300 rounded-sm flex items-center justify-center"
                >
                  <span className="text-sm font-medium text-gray-600">Product {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card Stack Note */}
          <div className="bg-primary/10 p-8 rounded-sm border-l-4 border-primary">
            <p className="text-xs uppercase tracking-wider font-medium text-primary mb-2">
              MOBILE SHOP (CARD STACK)
            </p>
            <p className="text-base text-gray-700">
              On mobile, the shop page uses a scroll-driven card stack animation instead of a grid.
              Cards are stacked in a deck; scrolling dismisses the top card, revealing the next.
              SCROLL_PER_CARD = 400px, SNAP_THRESHOLD = 0.35, with velocity-aware snapping.
            </p>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section>
        <div className="p-8 bg-gray-900 text-white rounded-sm">
          <h3 className="text-2xl font-bold mb-4">Grid Usage Guidelines</h3>
          <ul className="space-y-3 text-base">
            <li>• <strong>All layouts must align to 12-column grid</strong> - No arbitrary positioning</li>
            <li>• <strong>Use asymmetric splits</strong> for visual interest (7-5, 5-7, 8-4)</li>
            <li>• <strong>Generous gaps</strong>: Minimum 32px (gap-8) between grid items</li>
            <li>• <strong>Product grids</strong>: 24px gaps (gap-6) for efficient spacing</li>
            <li>• <strong>Consistent gutters</strong>: Desktop 32px, Tablet 24px, Mobile 16px</li>
            <li>• <strong>No decorative elements</strong> - Grid provides all structure needed</li>
            <li>• <strong>Collapse predictably</strong>: 12 cols → 2 cols → 1 col on mobile</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof GridSystem> = {
  title: 'Design System/03 - Grid',
  component: GridSystem,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '12-column Swiss grid system with precise mathematical specifications.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GridSystem>;

export const Swiss12ColumnGrid: Story = {};
