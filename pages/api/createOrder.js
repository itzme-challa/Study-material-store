import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productId, productName, amount, telegramLink } = req.body;

  try {
    const orderResponse = await axios.post(
      'https://api.cashfree.com/pg/orders',
      {
        order_id: `order_${productId}_${Date.now()}`,
        order_amount: amount,
        order_currency: 'INR',
        order_note: productName,
        customer_details: {
          customer_id: 'customer_' + Date.now(),
          customer_name: 'Study Material Customer',
          customer_email: 'customer@example.com',
          customer_phone: '9999999999'
        },
        order_meta: {
          return_url: `${req.headers.origin}/success?order_id={order_id}&telegram_link=${encodeURIComponent(telegramLink)}`
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': '605266b66d4c81295df88e013e662506',
          'x-client-secret': 'cfsk_ma_prod_3d5c1e52a60832d47f1eb1af9045d1c2_4b948447',
          'x-api-version': '2022-09-01'
        }
      }
    );

    const paymentLink = orderResponse.data.payment_link;
    res.status(200).json({ paymentLink });
  } catch (error) {
    console.error('Cashfree error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create payment order' });
  }
}
