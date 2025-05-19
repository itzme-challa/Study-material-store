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

  useEffect(() => {
    if (id) {
      fetch('/products.json')
        .then((res) => res.json())
        .then((data) => {
          const foundProduct = data.find((p) => p.id === parseInt(id));
          setProduct(foundProduct);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error loading product:', error);
          setIsLoading(false);
        });
    }
  }, [id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => console.log('Cashfree SDK loaded');
    document.body.appendChild(script);
  }, []);

  const handleBuyNow = async () => {
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
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }
      const paymentSessionId = data.paymentSessionId || data.payment_session_id;
      if (!window?.Cashfree || !paymentSessionId) {
        throw new Error('Cashfree SDK not loaded or session missing');
      }
      const cashfree = window.Cashfree({ mode: 'production' });
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_self',
      });
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
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-96">
            <Image
              src={product.image || '/default-book.jpg'}
              alt={product.name}
              fill
              className="object-cover rounded-lg shadow-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <Rating rating={product.rating} />
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold text-gray-700 mb-2">Author: {product.author}</p>
            <p className="text-lg font-semibold text-gray-700 mb-4">Category: {product.category}</p>
            <div className="features mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
              <button
                onClick={handleBuyNow}
                disabled={isBuying}
                className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ${
                  isBuying ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isBuying ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
