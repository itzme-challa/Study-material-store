// pages/checkout.js
import { useState } from 'react';

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const response = await fetch('/api/createOrder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productId: 'bio123',
        productName: 'Biology Master Notes',
        amount: 99,
        telegramLink: 'https://t.me/studymaterialbot?start=bio123'
      })
    });

    const data = await response.json();
    setLoading(false);

    if (data.success) {
      const cashfree = window.Cashfree({ mode: 'production' });

      cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: '_self'
      });
    } else {
      alert('Failed to create payment: ' + data.error);
    }
  };

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Buy Study Material</h1>
      <button id="renderBtn" onClick={handleCheckout} disabled={loading}>
        {loading ? 'Loading...' : 'Pay ₹99'}
      </button>

      <script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>
    </div>
  );
}
