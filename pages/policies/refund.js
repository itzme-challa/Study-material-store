import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 pt-16">
        <h1 className="text-3xl font-bold text-center mb-8">Refund & Cancellation Policy</h1>
        
        <div className="refund-card bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <p className="text-gray-700 text-lg text-center mb-4">
            We do not offer refunds for our digital products.
          </p>
          <p className="text-gray-700 text-lg text-center">
            For any assistance, please contact us at:{' '}
            <a href="mailto:itzme.eduhub.contact@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors">
              itzme.eduhub.contact@gmail.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
