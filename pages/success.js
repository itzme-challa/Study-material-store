import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function SuccessPage() {
  const router = useRouter();
  const { order_id, telegram_link } = router.query;
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (order_id && telegram_link) {
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
          console.log('Payment verification data:', data);

          if (!response.ok) {
            throw new Error(data.error || 'Verification failed');
          }

          if (data.order_status === 'PAID') {
            toast.success('Payment verified! Redirecting...');
            setTimeout(() => {
              window.location.href = decodeURIComponent(telegram_link);
            }, 2000);
          } else {
            toast.warning(`Payment status: ${data.order_status}`);
          }
        } catch (error) {
          console.error('Verification error:', error);
          toast.error(`Verification failed: ${error.message}`);
        } finally {
          setIsVerifying(false);
        }
      };

      verifyPayment();
    }
  }, [order_id, telegram_link]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <ToastContainer position="top-center" autoClose={5000} />
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          {isVerifying ? 'Verifying Payment...' : 'Payment Processed'}
        </h1>
        
        {isVerifying ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-6"></div>
            <p>Please wait while we verify your payment...</p>
          </>
        ) : (
          <>
            <p className="mb-6">Thank you for your purchase!</p>
            {telegram_link && (
              <a
                href={decodeURIComponent(telegram_link)}
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Access Your Study Material
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
