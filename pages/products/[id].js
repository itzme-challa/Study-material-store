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

    const fetchData = async () => {
      try {
        const [productsRes, materialRes] = await Promise.all([
          fetch('/products.json'),
          fetch('/material.json'),
        ]);

        const productsData = await productsRes.json().catch(() => []);
        const materialData = await materialRes.json().catch(() => []);

        const materialProducts = transformMaterialToProducts(materialData);
        const allProducts = [...(productsData || []), ...materialProducts];

        const foundProduct = allProducts.find(
          (item) => item.id?.toString() === id.toString()
        );

        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Failed to load product:', error);
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  function transformMaterialToProducts(materialData) {
    let idCounter = 1000;
    const category = 'NEET,JEE,BOARDS';

    if (!Array.isArray(materialData)) return [];

    return materialData.flatMap((group) =>
      (group.items || []).map((item) => ({
        id: idCounter++,
        name: item.label || 'Untitled',
        telegramLink: `https://t.me/Material_eduhubkmrbot?start=${item.key}`,
        description: `${item.label || 'Material'} - ${group.title || 'General'}`,
        category,
        author: 'Unknown',
        price: 99,
        rating: 4.5,
        image: '/default-book.jpg',
        features: ['Instant Telegram access', 'PDF format', 'Lifetime access'],
      }))
    );
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => console.log('Cashfree SDK loaded');
    document.body.appendChild(script);
  }, []);

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
      <main className="product-detail flex-grow">
        <div className="container mx-auto px-4">
          <div className="product-container grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
            <div className="relative w-full aspect-square">
              <Image
                src={product.image || '/default-book.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, 400px"
              />
            </div>
            <div className="content space-y-4">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <Rating rating={product.rating} />
              <p>{product.description}</p>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Author:</strong> {product.author}</p>
                <p><strong>Category:</strong> {product.category}</p>
              </div>
              {product.features?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold">Features:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex items-center space-x-6 pt-4">
                <span className="text-xl font-semibold text-indigo-600">₹{product.price}</span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={isBuying}
                  className={`px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition ${
                    isBuying ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isBuying ? 'Processing...' : 'Buy Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {isModalOpen && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">Enter Your Details</h2>
            <form onSubmit={handleBuyNow} className="space-y-4">
              {['customerName', 'customerEmail', 'customerPhone'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field === 'customerPhone' ? 'Phone (10 digits)' : field.replace('customer', '')}
                  </label>
                  <input
                    type={field === 'customerEmail' ? 'email' : field === 'customerPhone' ? 'tel' : 'text'}
                    id={field}
                    name={field}
                    value={formData[field]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border rounded-md p-2"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 ${
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
    </div>
  );
}
