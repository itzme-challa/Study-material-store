import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SuccessPage() {
  const router = useRouter();
  const { order_id, telegram_link } = router.query;

  useEffect(() => {
    if (order_id && telegram_link) {
      // Verify payment
      const verifyPayment = async () => {
        try {
          const response = await fetch('/api/verifyPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId: order_id }),
          });

          const data = await response.json();
          if (data.order_status === 'PAID') {
            toast.success('Payment successful! Redirecting to your study material...');
            setTimeout(() => {
              window.location.href = decodeURIComponent(telegram_link);
            }, 3000);
          } else {
            toast.error('Payment not verified. Please contact support.');
          }
        } catch (error) {
          toast.error('Error verifying payment. Please contact support.');
        }
      };

      verifyPayment();
    }
  }, [order_id, telegram_link]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ToastContainer />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        <p className="mb-6">Thank you for your purchase. We're preparing your study material...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <p>You'll be redirected shortly. If not, click below:</p>
        {telegram_link && (
          <a
            href={decodeURIComponent(telegram_link)}
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Access Study Material
          </a>
        )}
      </div>
    </div>
  );
}
