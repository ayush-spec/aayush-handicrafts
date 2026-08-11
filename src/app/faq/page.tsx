import type { Metadata } from 'next';
import { getAllFAQs } from '@/lib/sanity/queries';
import FAQAccordion from '@/components/faq/FAQAccordion';
import {
  DEFAULT_SHOP_FAQS,
  DEFAULT_GENERAL_FAQS,
} from '@/lib/constants/default-faqs';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `FAQ | ${siteConfig.brand.name}`,
  description: `Frequently asked questions about ${siteConfig.brand.name} silver, pricing, shipping, and more.`,
};

const SECTIONS = [
  { key: 'general', label: 'General', accent: 'bg-primary' },
  { key: 'shop', label: 'Shop & Shipping', accent: 'bg-accent-green' },
] as const;

const DEFAULTS: Record<string, { question: string; answer: string }[]> = {
  general: DEFAULT_GENERAL_FAQS,
  shop: DEFAULT_SHOP_FAQS,
};

export default async function FAQPage() {
  // Tolerate an unconfigured/unreachable CMS at build time — fall back to defaults.
  const allFaqs = await getAllFAQs().catch(() => []);

  const grouped = Object.fromEntries(
    SECTIONS.map(({ key }) => {
      const items = allFaqs.filter((f) => f.category === key);
      return [key, items.length > 0 ? items : DEFAULTS[key]];
    })
  );

  return (
    <div className="pt-header-lg pb-16 md:pb-24">
      {/* Hero */}
      <section className="px-[var(--container-padding-mobile)] md:px-[var(--container-padding-tablet)] xl:px-[var(--container-padding-desktop)] mb-10 md:mb-16">
        <h1 className="type-h1 text-ivory">
          Frequently Asked<br />Questions
        </h1>
        <p className="mt-3 text-ivory/45 text-base md:text-lg max-w-lg">
          Everything you need to know about our silver, pricing, and ordering process.
        </p>
      </section>

      {/* FAQ Sections */}
      <div className="space-y-12 md:space-y-20">
        {SECTIONS.map(({ key, label, accent }) => (
          <section
            key={key}
            className="px-[var(--container-padding-mobile)] md:px-[var(--container-padding-tablet)] xl:px-[var(--container-padding-desktop)]"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <span className={`w-2 h-2 rounded-full ${accent} shrink-0`} />
              <h2 className="type-h4 text-ivory">{label}</h2>
            </div>

            {/* Accordion */}
            <FAQAccordion items={grouped[key]} />
          </section>
        ))}
      </div>
    </div>
  );
}
