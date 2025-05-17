import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';

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
          telegramLink: product.telegramLink,
        }),
      });

      const data = await response.json();
      console.log('Create Order Response:', data); // Debug log

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      if (data.payment_session_id) {
        const cashfree = new window.Cashfree(data.payment_session_id);
        cashfree.checkout({
          paymentSessionId: data.payment_session_id,
          returnUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id=${data.order_id}&telegram_link=${encodeURIComponent(product.telegramLink)}`,
          redirect: true,
        });
      } else {
        throw new Error('Payment session ID not received');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="image-container">
        <Image
          src={product.image || '/default-course.jpg'}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="content">
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <div className="features">
          <h3>Features:</h3>
          <ul>
            {product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center">
          <span className="price">₹{product.price}</span>
          <button
            onClick={handleBuyNow}
            disabled={isLoading}
            className={`contact-button ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
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
  );
}
