import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
    toast.info('Preparing your payment...', { autoClose: 2000 });

    try {
      const response = await fetch('/api/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          amount: product.price,
          telegramLink: product.telegramLink,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || 
          data.details?.message || 
          `Payment failed (Status: ${response.status})`
        );
      }

      if (!data.paymentLink) {
        throw new Error('No payment link received from server');
      }

      // Track payment initiation
      console.log('Redirecting to payment:', data.paymentLink);
      window.location.href = data.paymentLink;

    } catch (error) {
      console.error('Checkout error:', error);
      
      toast.error(
        <div>
          <p className="font-bold">Payment Failed</p>
          <p>{error.message}</p>
          <p className="text-sm mt-1">
            Need help? Contact support@eduhub.com
          </p>
        </div>,
        { autoClose: 5000 }
      );

      // Fallback option
      if (product.telegramLink) {
        setTimeout(() => {
          if (confirm('Payment failed. Would you like to try manual payment?')) {
            window.location.href = product.telegramLink;
          }
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="image-container relative h-48 w-full overflow-hidden">
        <Image
          src={product.image || '/default-course.jpg'}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={product.featured}
        />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>

      <div className="content p-6 flex flex-col h-full">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {product.name}
          </h2>
          <p className="text-gray-600 mb-4 line-clamp-3">
            {product.description}
          </p>

          {product.features?.length > 0 && (
            <div className="features mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Includes:</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-4 h-4 mt-0.5 mr-2 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold text-indigo-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleBuyNow}
              disabled={isLoading}
              className={`flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
                isLoading ? 'opacity-80 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
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
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buy Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
