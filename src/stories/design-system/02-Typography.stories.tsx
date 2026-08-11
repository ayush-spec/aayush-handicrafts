import type { Meta, StoryObj } from '@storybook/nextjs-vite';

const Typography = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-6xl font-bold font-serif mb-4">Swiss Typography System</h1>
      <p className="text-xl leading-relaxed text-gray-700 mb-12 max-w-3xl">
        Massive scale contrast, tight negative letter-spacing for headlines, generous line-height.
        Using <strong>Maragsa Display</strong> (serif) for H1/H2 headlines and <strong>Gotham</strong> (sans, uppercase) for H3-H6 headings and body text.
      </p>

      {/* Display Headlines */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold font-serif mb-8 pb-4 border-b-2 border-gray-200">
          Display Headlines (Maragsa Display Serif)
        </h2>

        <div className="space-y-16">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H1 - HERO
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>96px / 104px / -2% tracking / bold</p>
                <p className="text-xs text-gray-400">Tablet: 72px, Mobile: 48px</p>
              </div>
            </div>
            <h1 className="text-[96px] leading-[104px] tracking-[-0.02em] font-bold font-serif text-gray-900">
              Mud Monkey<br />Studio
            </h1>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h1 or text-[96px] leading-[104px] tracking-[-0.02em] font-bold font-serif
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H2 - SECTION HEADERS
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>64px / 72px / -1% tracking / bold</p>
                <p className="text-xs text-gray-400">Tablet: 56px, Mobile: 40px</p>
              </div>
            </div>
            <h2 className="text-[64px] leading-[72px] tracking-[-0.01em] font-bold font-serif text-gray-900">
              Customer Favorites
            </h2>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h2 or text-[64px] leading-[72px] tracking-[-0.01em] font-bold font-serif
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H3 - SUBSECTIONS (Gotham Uppercase)
              </p>
              <p className="text-sm font-mono text-gray-500">
                48px / 56px / wider tracking / bold / UPPERCASE
              </p>
            </div>
            <h3 className="type-h3 text-gray-900">
              Shop by Category
            </h3>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h3 — font-sans uppercase tracking-wider. Mobile: 32px, Tablet: 40px
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H4 - CARD HEADLINES (Gotham Uppercase)
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>32px / 40px / bold / UPPERCASE</p>
                <p className="text-xs text-gray-400">Mobile: 24px</p>
              </div>
            </div>
            <h4 className="type-h4 text-gray-900">
              Handcrafted Ceramic Mug
            </h4>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h4 — font-sans uppercase tracking-wider. Mobile: 24px, Tablet: 28px
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H5 - SUBSECTION TITLES (Gotham Uppercase)
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>24px / 32px / bold / UPPERCASE</p>
                <p className="text-xs text-gray-400">Mobile: 20px</p>
              </div>
            </div>
            <h5 className="type-h5 text-gray-900">
              About This Piece
            </h5>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h5 — font-sans uppercase tracking-wider. Mobile: 20px, Tablet: 24px
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                H6 - CARD TITLES / SMALL (Gotham Uppercase)
              </p>
              <p className="text-sm font-mono text-gray-500">
                18px / 26px / bold / UPPERCASE (no scaling)
              </p>
            </div>
            <h6 className="type-h6 text-gray-900">
              session Details
            </h6>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-h6 — font-sans uppercase tracking-wider. Fixed 18px.
            </p>
          </div>
        </div>
      </section>

      {/* Body Text */}
      <section className="mb-20">
        <h2 className="text-4xl font-bold font-serif mb-8 pb-4 border-b-2 border-gray-200">
          Body Text (Gotham Sans)
        </h2>

        <div className="space-y-12 max-w-4xl">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                BODY LARGE
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>20px / 32px / +1% tracking</p>
                <p className="text-xs text-gray-400">Mobile: 18px / 28px</p>
              </div>
            </div>
            <p className="text-[20px] leading-[32px] tracking-[0.01em] font-sans text-gray-900">
              Delightfully quirky clayware that brings joy to your everyday moments.
              Each piece is handcrafted with love and attention to detail, making every item unique.
            </p>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-body-lg or text-[20px] leading-[32px] tracking-[0.01em]
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                BODY REGULAR
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>16px / 26px / +1% tracking</p>
                <p className="text-xs text-gray-400">Mobile: 15px / 24px</p>
              </div>
            </div>
            <p className="text-[16px] leading-[26px] tracking-[0.01em] font-sans text-gray-900">
              Discover your perfect piece of handcrafted pottery. Each item tells a unique story,
              crafted with care and attention to detail from locally-sourced materials.
              Our artisans pour their passion into every creation, ensuring exceptional quality.
            </p>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-body or text-[16px] leading-[26px] tracking-[0.01em]
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                BODY SMALL
              </p>
              <p className="text-sm font-mono text-gray-500">
                14px / 22px / +2% tracking
              </p>
            </div>
            <p className="text-[14px] leading-[22px] tracking-[0.02em] font-sans text-gray-900">
              Free shipping on orders over ₹2,000. Handmade in India with sustainable practices.
              Each piece is individually inspected for quality before shipping.
            </p>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-body-sm or text-[14px] leading-[22px] tracking-[0.02em]
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                LABEL / METADATA
              </p>
              <p className="text-sm font-mono text-gray-500">
                12px / 16px / +8% tracking / UPPERCASE / medium weight
              </p>
            </div>
            <p className="text-[12px] leading-[16px] tracking-[0.08em] uppercase font-medium font-sans text-gray-900">
              HANDCRAFTED WITH LOVE
            </p>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-label or text-[12px] leading-[16px] tracking-[0.08em] uppercase font-medium
            </p>
          </div>

          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-medium text-gray-500">
                PRICE
              </p>
              <div className="text-right text-sm font-mono text-gray-500">
                <p>28px / 36px / bold</p>
                <p className="text-xs text-gray-400">Mobile: 24px / 32px</p>
              </div>
            </div>
            <p className="text-[28px] leading-[36px] font-bold font-sans text-primary">
              ₹1,299
            </p>
            <p className="mt-4 text-sm text-gray-600 font-mono">
              .type-price or text-[28px] leading-[36px] font-bold
            </p>
          </div>
        </div>
      </section>

      {/* Type Scale Visualization */}
      <section>
        <h2 className="text-4xl font-bold font-serif mb-8 pb-4 border-b-2 border-gray-200">
          Type Scale Visualization
        </h2>

        <div className="space-y-1">
          {[
            { size: 96, name: 'H1 (Hero) — Serif', lineHeight: 104 },
            { size: 64, name: 'H2 (Section) — Serif', lineHeight: 72 },
            { size: 48, name: 'H3 (Subsection) — SANS UC', lineHeight: 56 },
            { size: 32, name: 'H4 (Card) — SANS UC', lineHeight: 40 },
            { size: 24, name: 'H5 (Sub) — SANS UC', lineHeight: 32 },
            { size: 18, name: 'H6 (Small) — SANS UC', lineHeight: 26 },
            { size: 28, name: 'Price', lineHeight: 36 },
            { size: 20, name: 'Body Large', lineHeight: 32 },
            { size: 16, name: 'Body Regular', lineHeight: 26 },
            { size: 14, name: 'Body Small', lineHeight: 22 },
            { size: 12, name: 'Label', lineHeight: 16 },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-8 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs uppercase tracking-wider font-medium text-gray-500 w-40">
                {item.name}
              </span>
              <span className="text-sm text-gray-600 w-24 font-mono">
                {item.size}px
              </span>
              <span className="text-xs text-gray-400 w-24 font-mono">
                LH: {item.lineHeight}px
              </span>
              <div
                className="h-2 bg-primary rounded-sm"
                style={{ width: `${item.size * 2}px` }}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-100 rounded-sm">
          <h3 className="text-xl font-bold mb-3">Typography Guidelines</h3>
          <ul className="space-y-2 text-base text-gray-700">
            <li>• <strong>Massive scale contrast</strong>: 96px headlines down to 12px labels creates drama</li>
            <li>• <strong>Negative letter-spacing</strong>: Headlines use -1% to -2% for tighter, bolder look</li>
            <li>• <strong>Generous line-height</strong>: Body text has 1.6x line height for readability</li>
            <li>• <strong>ALL-CAPS labels</strong>: 12px uppercase with +8% tracking for structure</li>
            <li>• <strong>Serif for H1/H2, Sans uppercase for H3-H6</strong>: Creates clear visual hierarchy</li>
            <li>• <strong>Buttons always uppercase</strong>: All Button component text is uppercase with tracking-wider</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const meta: Meta<typeof Typography> = {
  title: 'Design System/02 - Typography',
  component: Typography,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Swiss typography system with massive scale contrast and precise specifications.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const SwissTypographyScale: Story = {};
