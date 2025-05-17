import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Request body:', JSON.stringify(req.body, null, 2)); // Log incoming request

  const { productId, productName, amount, telegramLink } = req.body;

  try {
    const response = await axios.post(
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
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}&telegram_link=${encodeURIComponent(telegramLink)}`
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_APP_ID,
          'x-client-secret': process.env.CF_SECRET_KEY,
          'x-api-version': '2022-09-01'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    console.log('Cashfree response:', response.data);
    res.status(200).json({ paymentLink: response.data.payment_link });
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: 'Failed to create payment order',
      details: error.response?.data || error.message
    });
  }
}
