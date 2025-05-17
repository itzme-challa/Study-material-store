import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Request body:', JSON.stringify(req.body, null, 2));

  const { productId, productName, amount, telegramLink } = req.body;

  // Validate required fields
  if (!productId || !productName || !amount || !telegramLink) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields' 
    });
  }

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
        timeout: 15000
      }
    );

    console.log('Cashfree API response:', response.data);
    
    // Use the direct payment link from Cashfree response
    const paymentLink = `https://payments.cashfree.com/order/#${response.data.cf_order_id}`;
    
    res.status(200).json({ 
      success: true,
      paymentLink: paymentLink,
      orderId: response.data.order_id
    });

  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to create payment order',
      details: error.response?.data || error.message
    });
  }
}
