import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    setIsLoading(true);
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
          telegramLink: product.telegramLink
        }),
      });

      const data = await response.json();
      console.log('Order creation response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      if (data.paymentLink) {
        console.log('Redirecting to payment page:', data.paymentLink);
        window.location.href = data.paymentLink;
      } else {
        throw new Error('Payment link not received');
      }
    } catch (error) {
      console.error('Payment initiation error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">₹{product.price}</span>
          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
