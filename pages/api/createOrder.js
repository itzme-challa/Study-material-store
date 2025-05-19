import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const { productId, productName, amount, telegramLink } = req.body;

  if (!productId || !productName || !amount || !telegramLink) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  const orderId = `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  try {
    const response = await axios.post(
      'https://api.cashfree.com/pg/orders',
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        customer_details: {
          customer_id: 'cust_' + productId,
          customer_email: 'dummy@example.com', // Replace or collect from user
          customer_phone: '9999999999', // Replace or collect from user
        },
        order_meta: {
          return_url: `https://yourdomain.com/success?order_id={order_id}`, // Optional
          notify_url: `https://yourdomain.com/api/webhook`, // Optional
        },
        order_note: telegramLink, // optional, you can use it to store the link
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-version': '2022-09-01',
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
        },
      }
    );

    const paymentSessionId = response.data.payment_session_id;

    return res.status(200).json({
      success: true,
      paymentSessionId,
      orderId,
    });
  } catch (error) {
    console.error('Cashfree order creation failed:', error?.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create Cashfree order',
    });
  }
}
