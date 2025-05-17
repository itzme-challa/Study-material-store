import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ContactUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Contact Us</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">Email</h3>
                  <p className="text-indigo-600">support@eduhub.com</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Telegram</h3>
                  <p className="text-indigo-600">@EduHubSupportBot</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Business Hours</h3>
                  <p className="text-gray-700">Mon-Sat: 10AM - 6PM IST</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                </div>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                  Send Message
                </button>
              </form>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
