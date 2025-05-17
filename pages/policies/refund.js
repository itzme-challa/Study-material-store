import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Refund & Cancellation Policy</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Digital Products Policy</h2>
            <p className="text-gray-700 mb-4">
              Due to the nature of digital products, all sales are final. We do not offer refunds once the study materials have been delivered to your Telegram account.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Exceptions</h2>
            <p className="text-gray-700 mb-2">
              Refunds may be considered in the following exceptional cases:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Duplicate payment for the same product</li>
              <li>Technical error from our side preventing access</li>
              <li>Material not as described (requires verification)</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Refund Process</h2>
            <p className="text-gray-700 mb-2">
              To request a refund, please contact us within 7 days of purchase at:
            </p>
            <p className="text-indigo-600">support@eduhub.com</p>
            <p className="text-gray-700 mt-2">
              Include your order details and reason for refund. Processing may take 7-10 business days.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
