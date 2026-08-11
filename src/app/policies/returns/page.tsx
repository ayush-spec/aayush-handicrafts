import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Aayush Handicrafts',
  description:
    'Returns and exchanges policy for Aayush Handicrafts. Learn about our return process for damaged items, refunds, and workshop bookings.',
};

export default function ReturnsPage() {
  return (
    <div className="pt-header">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="type-h2 text-ivory mb-2">
          Returns &amp; Exchanges
        </h1>
        <p className="text-ivory/55 text-lg mb-10">
          We hope you love what you receive (it&apos;s packed with a lot of care
          ✨). Since each piece is handmade, slight variations are part of its
          charm.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Returns (Damaged Items Only)
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              We only accept returns if your item arrives damaged or defective
              within <strong>48 hours</strong> of delivery.
            </p>
            <p className="text-ivory/75 leading-relaxed mt-3">
              We recommend recording an open box video while unboxing, as it
              helps us resolve issues faster.
            </p>
            <p className="text-ivory/75 leading-relaxed mt-3">
              If there&apos;s damage, please share:
            </p>
            <ul className="list-disc list-inside space-y-2 text-ivory/75 leading-relaxed mt-2">
              <li>Your order number</li>
              <li>Clear photos of the product and packaging</li>
              <li>Open box video</li>
            </ul>
            <p className="text-ivory/75 leading-relaxed mt-3">
              Once approved, we&apos;ll arrange a return and process a full
              refund.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Exchanges</h2>
            <p className="text-ivory/75 leading-relaxed">
              We currently do not offer exchanges. Each piece is made in small
              batches, and availability is often limited.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Refunds</h2>
            <p className="text-ivory/75 leading-relaxed">
              Refunds are only issued for items that arrive damaged or
              defective, and will be processed to your original mode of payment.
            </p>
          </div>

          <div>
            
          </div>

          <div className="pt-4 border-t border-ivory/10">
            <p className="text-ivory/55">
              Questions? Just drop us a message at{' '}
              <a
                href="mailto:hello@aayushhandicrafts.com"
                className="text-primary hover:underline"
              >
                hello@aayushhandicrafts.com
              </a>{' '}
              &mdash; we&apos;re usually around.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
