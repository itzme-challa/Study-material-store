import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const router = useRouter();

  const handleBuyNow = async () => {
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
    console.log('API response:', data); // Add this line
    
    if (!response.ok) {
      throw new Error(data.error || 'Payment failed');
    }
    
    if (data.paymentLink) {
      window.location.href = data.paymentLink;
    } else {
      throw new Error('No payment link received');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    toast.error(error.message);
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
