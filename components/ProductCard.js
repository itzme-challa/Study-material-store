import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  const initiateManualPayment = () => {
    const message = `I want to purchase ${product.name} (₹${product.price}). Please share payment details.`;
    window.open(
      `https://wa.me/919999999999?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  const handleBuyNow = async () => {
    setIsLoading(true);
    toast.info('Preparing payment gateway...', { autoClose: 2000 });

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
          `Payment gateway error (${response.status})`
        );
      }

      if (!data.paymentLink) {
        throw new Error('Payment system temporarily unavailable');
      }

      // Track payment initiation (you can add analytics here)
      console.log('Redirecting to payment gateway...');
      window.location.href = data.paymentLink;

    } catch (error) {
      console.error('Payment Error:', error);
      
      toast.error(
        <div>
          <p className="font-bold">Payment Gateway Issue</p>
          <p>{error.message}</p>
          <button 
            onClick={initiateManualPayment}
            className="mt-2 text-sm underline text-blue-600 hover:text-blue-800"
          >
            Click here for manual payment options
          </button>
        </div>,
        { autoClose: 8000 }
      );

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* ... (keep existing JSX structure) ... */}
      
      <button
        onClick={handleBuyNow}
        disabled={isLoading}
        className={`flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg ${
          isLoading ? 'opacity-80 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" /* ... */ />
            Processing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" /* ... */ />
            Buy Now
          </>
        )}
      </button>
    </div>
  );
}
