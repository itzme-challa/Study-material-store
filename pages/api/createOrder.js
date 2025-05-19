// pages/api/createOrder.js
import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productId, productName, amount, telegramLink } = req.body;

  if (!productId || !productName || !amount || !telegramLink) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const orderResponse = await axios.post(
      'https://api.cashfree.com/pg/orders',
      {
        order_id: `order_${productId}_${Date.now()}`,
        order_amount: amount,
        order_currency: 'INR',
        order_note: productName,
        customer_details: {
          customer_id: 'cust_' + Date.now(),
          customer_name: 'Study Material Buyer',
          customer_email: 'buyer@example.com',
          customer_phone: '9999999999'
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}&telegram_link=${encodeURIComponent(telegramLink)}`
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_APP_ID,
          'x-client-secret': process.env.CF_SECRET_KEY,
          'x-api-version': '2022-09-01'
        }
      }
    );

    const paymentSessionId = orderResponse.data.payment_session_id;

    res.status(200).json({
      success: true,
      paymentSessionId
    });

  } catch (error) {
    console.error('Cashfree order error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Payment creation failed', details: error.response?.data || error.message });
  }
}
