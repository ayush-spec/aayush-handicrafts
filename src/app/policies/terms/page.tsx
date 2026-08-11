import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Aayush Handicrafts',
  description:
    'Terms of service for Aayush Handicrafts. Learn about our product policies, shipping, cancellations, and more.',
};

export default function TermsPage() {
  return (
    <div className="pt-header">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="type-h2 text-ivory mb-2">Terms of Service</h1>
        <p className="text-ivory/55 text-lg mb-10">
          Welcome to our little corner of handmade things 🤍
          <br />
          By placing an order with us, you agree to the following terms.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="type-h5 text-ivory mb-3">Products</h2>
            <p className="text-ivory/75 leading-relaxed">
              Each piece is handmade, so slight variations in shape, color, and
              finish are completely normal. These are not flaws, but part of what
              makes your piece one of a kind.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Order Processing &amp; Shipping
            </h2>
            <ul className="list-disc list-inside space-y-2 text-ivory/75 leading-relaxed">
              <li>Orders are processed within 5&ndash;10 working days</li>
              <li>
                Delivery typically takes 7&ndash;10 working days, depending on
                your location
              </li>
              <li>
                For custom or made-to-order pieces, shipping may take 4&ndash;6
                weeks
              </li>
            </ul>
            <p className="text-ivory/75 leading-relaxed mt-3">
              You&apos;ll receive tracking details once your order is shipped.
              Delays can occasionally happen, but we&apos;ll keep you posted.
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

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Intellectual Property
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              All designs, images, and content belong to Aayush Handicrafts and
              cannot be copied or reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Cancellations</h2>
            <p className="text-ivory/75 leading-relaxed">
              Orders can be cancelled within 24 hours of placing them.
            </p>
            <p className="text-ivory/75 leading-relaxed mt-2">
              To request a cancellation, please reach out to us at{' '}
              <a
                href="mailto:hello@aayushhandicrafts.com"
                className="text-primary hover:underline"
              >
                hello@aayushhandicrafts.com
              </a>{' '}
              with your order details.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Contact</h2>
            <p className="text-ivory/75 leading-relaxed">
              For any questions or concerns, feel free to reach out to us at{' '}
              <a
                href="mailto:hello@aayushhandicrafts.com"
                className="text-primary hover:underline"
              >
                hello@aayushhandicrafts.com
              </a>
              .
            </p>
          </div>

          <p className="text-ivory/55 pt-4">
            Thank you for supporting handmade 🌿
          </p>
        </div>
      </section>
    </div>
  );
}
