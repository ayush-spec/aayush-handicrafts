import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Aayush Handicrafts',
  description:
    'Shipping policy for Aayush Handicrafts. Learn about processing times, delivery estimates, and shipping details.',
};

export default function ShippingPage() {
  return (
    <div className="pt-header">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="type-h2 text-ivory mb-2">Shipping Policy</h1>
        <p className="text-ivory/55 text-lg mb-10">
          Every piece is carefully wrapped and shipped with love 🤍
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="type-h5 text-ivory mb-3">Processing Time</h2>
            <p className="text-ivory/75 leading-relaxed">
              Orders are processed within <strong>5&ndash;10 working days</strong>.
              For custom or made-to-order pieces, processing may take{' '}
              <strong>4&ndash;6 weeks</strong>.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Delivery</h2>
            <p className="text-ivory/75 leading-relaxed">
              Delivery typically takes <strong>7&ndash;10 working days</strong>,
              depending on your location. You&apos;ll receive tracking details
              once your order is shipped.
            </p>
            <p className="text-ivory/75 leading-relaxed mt-3">
              Delays can occasionally happen due to courier services, but
              we&apos;ll keep you posted.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Shipping Cost</h2>
            <p className="text-ivory/75 leading-relaxed">
              We currently offer <strong>free shipping</strong> on all orders
              within India.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Packaging</h2>
            <p className="text-ivory/75 leading-relaxed">
              Each piece is carefully packed in tamper-proof, protective packaging
              and securely packaged to ensure it reaches you safely.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Shipping Responsibility
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              Once your order has been shipped, we are not responsible for delays
              caused by courier services. Please ensure all shipping details are
              accurate at checkout.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Failed Deliveries</h2>
            <p className="text-ivory/75 leading-relaxed">
              If an order is returned due to an incorrect address or failed
              delivery attempts, reshipping charges will apply.
            </p>
          </div>

          <div className="pt-4 border-t border-ivory/10">
            <p className="text-ivory/55">
              Questions about your order? Reach out at{' '}
              <a
                href="mailto:hello@aayushhandicrafts.com"
                className="text-primary hover:underline"
              >
                hello@aayushhandicrafts.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
