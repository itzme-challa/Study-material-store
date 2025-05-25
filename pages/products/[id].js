// pages/products/[id].js

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

  // Load Cashfree SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => console.log('Cashfree SDK loaded');
    document.body.appendChild(script);
  }, []);

  // Load product data
  useEffect(() => {
    if (!id) return;

    async function loadProduct() {
      setIsLoading(true);
      try {
        const [productsData, materialData] = await Promise.all([
          fetch('/products.json').then(res => res.json()),
          fetch('/material.json').then(res => res.json()),
        ]);

        let foundProduct = productsData.find(p => String(p.id) === String(id));
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          // Try to find in material.json
          for (const section of materialData) {
            const item = section.items.find(i => String(i.key) === String(id));
            if (item) {
              foundProduct = {
                id,
                name: item.label,
                description: `${item.label} from ${section.title}`,
                category: 'NEET, JEE, BOARDS',
                price: 29,
                author: 'EduHubKMR',
                features: [
                  'PDF + Telegram Access',
                  'Instant Delivery After Payment',
                  'Works on Any Device',
                ],
                telegramLink: `https://t.me/Material_eduhubkmrbot?start=${id}`,
                rating: 4.5,
                image: '/default-book.jpg',
              };
              break;
            }
          }
          if (foundProduct) {
            setProduct(foundProduct);
          } else {
            setProduct(null);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { customerName, customerEmail, customerPhone } = formData;
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Please fill in all fields.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      toast.error('Invalid email format.');
      return false;
    }
    if (!/^\d{10}$/.test(customerPhone)) {
      toast.error('Phone number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleBuyNow = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsBuying(true);
    try {
      const res = await fetch('/api/createOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: product.id,
          productName: product.name,
          amount: product.price,
          telegramLink: product.telegramLink,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order.');
      }

      if (!window?.Cashfree || !data.paymentSessionId) {
        throw new Error('Cashfree SDK not ready.');
      }

      const cashfree = window.Cashfree({ mode: 'production' });
      cashfree.checkout({ paymentSessionId: data.paymentSessionId, redirectTarget: '_self' });

      setFormData({ customerName: '', customerEmail: '', customerPhone: '' });
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative h-80 w-full">
            <Image
              src={product.image || '/default-book.jpg'}
              alt={product.name}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <Rating rating={product.rating} />
            <p className="text-gray-700 my-4">{product.description}</p>
            <p><strong>Author:</strong> {product.author}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <div className="mt-4">
              <h3 className="text-lg font-medium">Features:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {product.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isBuying}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
              >
                {isBuying ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleBuyNow} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border rounded p-2"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" disabled={isBuying} className="px-4 py-2 bg-indigo-600 text-white rounded">
                  {isBuying ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
