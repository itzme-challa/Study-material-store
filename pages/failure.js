import { useRouter } from 'next/router';
import Link from 'next/link';

export default function FailurePage() {
  const router = useRouter();
  const { order_id } = router.query;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>
        <p className="mb-6">We couldn't process your payment. Please try again.</p>
        {order_id && (
          <p className="text-sm text-gray-500 mb-6">Order ID: {order_id}</p>
        )}
        <div className="flex flex-col space-y-3">
          <Link href="/">
            <a className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Return to Store
            </a>
          </Link>
          <Link href={`mailto:support@example.com?subject=Payment%20Failed&body=Order%20ID:%20${order_id}`}>
            <a className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors">
              Contact Support
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
