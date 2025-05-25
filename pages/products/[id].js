import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import Rating from '../../components/Rating';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  useEffect(() => {
    if (!id) return;

    async function loadData() {
      setIsLoading(true);
      try {
        const productsRes = await fetch('/products.json');
        const productsData = await productsRes.json();

        const materialRes = await fetch('/material.json');
        const materialData = await materialRes.json();

        const maxProductId = productsData.reduce((maxId, p) => Math.max(maxId, p.id), 0);
        let nextId = maxProductId + 1;

        const materialProducts = [];
        materialData.forEach((category) => {
          category.items.forEach((item) => {
            materialProducts.push({
              id: nextId++,
              name: item.label,
              description: `${category.title} - ${item.label}`,
              category: 'Premium Materials',
              price: 10,
              rating: 0,
              author: '',
              features: [],
              telegramLink: `https://t.me/Material_eduhubkmrbot?start=${item.key}`,
              image: generateImageUrl(item.label),
            });
          });
        });

        const combinedProducts = [...productsData, ...materialProducts];
        const foundProduct = combinedProducts.find((p) => p.id === parseInt(id));
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error loading product or material:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => console.log('Cashfree SDK loaded');
    document.body.appendChild(script);
  }, []);

  const generateImageUrl = (title) => {
    const encodedTitle = encodeURIComponent(title);
    return `https://ui-avatars.com/api/?name=${encodedTitle}&background=random&size=400&format=svg`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      toast.error('Please fill in all fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      toast.error('Please enter a valid email.');
      return false;
    }
    if (!/^\d{10}$/.test(formData.customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return false;
    }
    return true;
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsBuying(true);
    try {
      const response = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          amount: product.price,
          telegramLink: product.telegramLink,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      const paymentSessionId = data.paymentSessionId;
      if (!window?.Cashfree || !paymentSessionId) {
        throw new Error('Cashfree SDK not loaded or session missing');
      }

      const cashfree = window.Cashfree({ mode: 'production' });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_self',
      });

      setFormData({ customerName: '', customerEmail: '', customerPhone: '' });
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) return <div className="p-6 text-center">Loading product...</div>;
  if (!product) return <div className="p-6 text-center text-red-600">Product not found</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 relative h-80 md:h-96">
            <Image
              src={product.image || generateImageUrl(product.name)}
              alt={product.name}
              layout="fill"
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p>{product.description}</p>
            <p><strong>Author:</strong> {product.author || 'N/A'}</p>
            <p><strong>Category:</strong> {product.category}</p>

            {product.features?.length > 0 && (
              <div>
                <h3 className="font-semibold">Features:</h3>
                <ul className="list-disc ml-5">
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xl font-semibold">₹{product.price}</p>

            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isBuying}
              className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition ${
                isBuying ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isBuying ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleBuyNow} className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                  Phone (10 digits)
                </label>
                <input
                  type="tel"
                  id="customerPhone"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBuying}
                  className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${
                    isBuying ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isBuying ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
