import Link from 'next/link';
import VortexGallery from '@/components/landing/VortexGallery';
import HoverMaskReveal from '@/components/landing/HoverMaskReveal';
import CinematicScroll from '@/components/landing/CinematicScroll';
import { getAllProducts } from '@/lib/sanity/queries';
import { getEffectiveRate, withComputedPrices } from '@/lib/pricing';
import { getOptimizedImageUrl } from '@/lib/sanity/image';
import { formatPrice } from '@/lib/utils/currency';

// Local demo items (used only when Sanity has no products yet).
const LOCAL_VORTEX_FALLBACK = [
  { id: 'l1', title: 'Silver Kada / Bangle', image: '/images/products/Silver%20kada-bangle/1.webp', href: '/shop' },
  { id: 'l2', title: 'Kamadhenu Cow with Calf', image: '/images/products/Kamadhenu%20Cow%20with%20Calf/1.webp', href: '/shop' },
  { id: 'l3', title: 'Jug with Glasses Set', image: '/images/products/Jug%20with%20glasses%20set/1.webp', href: '/shop' },
  { id: 'l4', title: 'Pooja Thali Set', image: '/images/products/Pooja%20Thali/1.webp', href: '/shop' },
  { id: 'l5', title: 'Anklet / Payal', image: '/images/products/Anklet-Payal/2.webp', href: '/shop' },
  { id: 'l6', title: 'Trinket Box', image: '/images/products/Trinket%20box/1.webp', href: '/shop' },
  { id: 'l7', title: 'Charan Paduka', image: '/images/products/Charan%20Paduka-%20Footprints%20of%20God/1.webp', href: '/shop' },
];

export default async function Home() {
  // Tolerate an unconfigured/unreachable CMS at build time.
  const [rawProducts, rate] = await Promise.all([
    getAllProducts().catch(() => []),
    getEffectiveRate(),
  ]);
  const products = withComputedPrices(rawProducts, rate);

  const vortexItems = products
    .filter((p) => p.images?.[0])
    .map((p) => ({
      id: p._id,
      title: p.title,
      image: getOptimizedImageUrl(p.images[0], { width: 800 }),
      href: `/shop/${p.slug.current}`,
    }));

  // Demo fallback: before Sanity is configured, show the seed photography
  // from /public so the landing still renders. Links go to /shop.
  const vortexOrFallback =
    vortexItems.length > 0
      ? vortexItems
      : LOCAL_VORTEX_FALLBACK;

  const curated = products.slice(0, 3);

  return (
    <main className="min-h-screen relative">
      {/* 1. Vortex hero — rotating ring of the collection */}
      <VortexGallery items={vortexOrFallback} />

      {/* 2. Brand statement */}
      <section className="brand-statement">
        <span className="label-caps">A Philosophy of Craft</span>
        <p>
          &ldquo;Every piece is a work of art handcrafted with love and
          compassion, celebrated for the little irregularities which enhance
          its intricate design, bringing imperfect patterns of grace and
          leisure to life.&rdquo;
        </p>
      </section>

      {/* 3. Cinematic scroll — silver detail zoom */}
      <CinematicScroll imageUrl="/images/editorial/bangle.jpg" />

      {/* 4. Curated pieces — spotlight reveal cards */}
      <section className="container mx-auto px-[clamp(1.5rem,4vw,4rem)] pb-[clamp(4rem,8vw,8rem)]">
        <div className="section-header">
          <h2 className="font-serif text-ivory" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}>
            Curated Pieces
          </h2>
          <Link href="/shop">View Full Collection</Link>
        </div>
        <div className="product-grid">
          {curated.length > 0
            ? curated.map((p) => (
                <HoverMaskReveal
                  key={p._id}
                  title={p.title}
                  image={getOptimizedImageUrl(p.images[0], { width: 800 })}
                  href={`/shop/${p.slug.current}`}
                  specLine1={`${p.purity === '925' ? '92.5%' : '99.9%'} Silver · ${p.weightGrams}g`}
                  specLine2={p.price ? formatPrice(p.price) : undefined}
                />
              ))
            : LOCAL_VORTEX_FALLBACK.slice(0, 3).map((item) => (
                <HoverMaskReveal
                  key={item.id}
                  title={item.title}
                  image={item.image}
                  href={item.href}
                />
              ))}
        </div>
      </section>
    </main>
  );
}
