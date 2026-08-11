import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Aayush Handicrafts',
  description:
    'Privacy policy for Aayush Handicrafts. Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="pt-header">
      <section className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <h1 className="type-h2 text-ivory mb-2">Privacy Policy</h1>
        <p className="text-ivory/55 text-lg mb-10">
          Your privacy matters to us. Here&apos;s how we handle your
          information.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Information We Collect
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              When you place an order or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside space-y-2 text-ivory/75 leading-relaxed mt-2">
              <li>Name and contact details (email, phone number)</li>
              <li>Shipping and billing address</li>
              <li>Order and transaction details</li>
              <li>
                Messages you send us via the contact form, email, or WhatsApp
              </li>
            </ul>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              How We Use Your Information
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              We use your information to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-ivory/75 leading-relaxed mt-2">
              <li>Process and fulfill your orders</li>
              <li>Send order updates and tracking information</li>
              <li>Respond to your questions and requests</li>
              <li>Improve our products and website experience</li>
            </ul>
            <p className="text-ivory/75 leading-relaxed mt-3">
              We will never sell or rent your personal information to third
              parties.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Payment Security</h2>
            <p className="text-ivory/75 leading-relaxed">
              All payments are processed securely through{' '}
              <strong>Razorpay</strong>, a PCI DSS Level 1 certified payment
              gateway. We do not store your credit card, UPI, or payment details
              on our servers. Razorpay is RBI-authorised and trusted by
              thousands of Indian businesses.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Cookies &amp; Analytics
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              Our website may use cookies to remember your cart and improve your
              browsing experience. We may also use basic analytics to understand
              how visitors use our site, helping us make it better for you.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">
              Third-Party Services
            </h2>
            <p className="text-ivory/75 leading-relaxed">
              We use the following third-party services that may process your
              data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-ivory/75 leading-relaxed mt-2">
              <li>
                <strong>Razorpay</strong> &mdash; for secure payment processing
              </li>
              <li>
                <strong>Courier partners</strong> &mdash; for order delivery
                (name, address, and phone number are shared for shipping)
              </li>
            </ul>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Your Rights</h2>
            <p className="text-ivory/75 leading-relaxed">
              You can request to view, update, or delete your personal
              information at any time by contacting us.
            </p>
          </div>

          <div>
            <h2 className="type-h5 text-ivory mb-3">Contact</h2>
            <p className="text-ivory/75 leading-relaxed">
              If you have any questions about this privacy policy, reach out to
              us at{' '}
              <a
                href="mailto:hello@aayushhandicrafts.com"
                className="text-primary hover:underline"
              >
                hello@aayushhandicrafts.com
              </a>
            </p>
            <p className="text-ivory/45 text-sm mt-2">
              Aayush Handicrafts
              <br />
              61, Kissan Marg, Barkat Nagar, Tonk Phatak
              <br />
              Jaipur, Rajasthan 302015
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
