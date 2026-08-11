import type { Metadata } from 'next';
import Image from 'next/image';
import { siteConfig } from '@/config/site.config';

export const metadata: Metadata = {
  title: `Our Craft | ${siteConfig.brand.name}`,
  description:
    'Irregularities as grace — the silversmiths of Jaipur, 92.5% sterling vs 97% pure silver, and the creed of beautiful imperfection.',
};

const SECTIONS = [
  {
    label: 'Legacy',
    title: 'The Silversmiths of Jaipur',
    body: 'For centuries, Jaipur has served as the epicentre of luxury silver handicraft in India. Our family workshop employs generational artisans who still use hand-cast mouldings, intricate chasing tools, and traditional polishing leaves. We reject uniform mechanical stamping; we believe the soul of silver is forged by the hands that touch it.',
  },
  {
    label: 'Purity',
    title: '92.5% Sterling vs 97% Pure',
    body: 'Our pieces range from 92.5% sterling silver for durable jewellery like bangles and anklets, up to 97% purity for ritual pooja thalis and home tableware. Tableware remains tarnish-resistant and brightly lustrous, while ornaments maintain structural integrity and lifelong wearability.',
  },
  {
    label: 'The Creed',
    title: 'Beautifully Imperfect',
    body: 'If you look closely at our scalloped Pooja thalis or embossed water jugs, you will notice minuscule variations in hexagonal outlines, slight weight disparities, and micro-marks of chisel hammer strokes. These are not flaws — they are the hallmarks of authentic manual crafting. Each irregularity is a marker of time, devotion, and character.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-header-lg pb-16 md:pb-24">
      <div className="container mx-auto px-[clamp(1.5rem,4vw,4rem)] max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-[clamp(3rem,6vw,5rem)]">
          <span className="label-caps" style={{ display: 'block', marginBottom: '1rem' }}>
            Jaipur Tradition
          </span>
          <h1 className="font-serif font-light text-ivory" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}>
            Irregularities As Grace
          </h1>
        </div>

        {/* Layout: image + editorial */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(2rem,5vw,4rem)] items-start">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/images/products/Kamadhenu Cow with Calf/1.webp"
              alt="Silver craftsmanship detail"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="space-y-[clamp(2rem,4vw,3rem)]">
            {SECTIONS.map((s) => (
              <div key={s.label}>
                <span className="label-caps" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  {s.label}
                </span>
                <h3 className="font-serif font-light text-ivory mb-3" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)' }}>
                  {s.title}
                </h3>
                <p className="text-ivory/55 leading-relaxed font-light">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
