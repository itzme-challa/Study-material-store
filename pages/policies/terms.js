import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function TermsConditions() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Terms & Conditions</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. General Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing and using our website and purchasing our study materials, you accept and agree to be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Product Usage</h2>
            <p className="text-gray-700 mb-2">
              All study materials provided are for personal use only. You agree not to:
            </p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Redistribute or share the materials with others</li>
              <li>Use the materials for commercial purposes</li>
              <li>Modify or create derivative works</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. Payments</h2>
            <p className="text-gray-700">
              All payments are processed through Cashfree Payments. We do not store your payment information on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. Changes to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these terms at any time. Your continued use of the service constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
