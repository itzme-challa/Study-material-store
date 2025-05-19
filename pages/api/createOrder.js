import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { productId, productName, amount, telegramLink } = req.body;

  if (!productId || !productName || !amount || !telegramLink) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
    });
  }

  try {
    // Generate a unique order ID for Cashfree
    const orderId = `order_${productId}_${Date.now()}`;

    // Create the order in Cashfree
    const orderResponse = await axios.post(
      'https://api.cashfree.com/pg/orders',
      {
        order_id: orderId,
        order_amount: amount,
        order_currency: 'INR',
        order_note: productName,
        customer_details: {
          customer_id: 'customer_' + Date.now(),
          customer_name: 'Study Material Customer',
          customer_email: 'customer@example.com',
          customer_phone: '9999999999',
        },
        order_meta: {
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id=${orderId}&telegram_link=${encodeURIComponent(
            telegramLink
          )}`,
          notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paymentWebhook`,
        },
        order_tags: {
          product_id: productId,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_APP_ID,
          'x-client-secret': process.env.CF_SECRET_KEY,
          'x-api-version': '2022-09-01',
        },
        timeout: 15000,
      }
    );

    console.log('Cashfree Order API response:', orderResponse.data);

    // Construct the payment URL (use cf_order_id from response)
    const paymentLink = `https://payments.cashfree.com/order/${orderResponse.data.cf_order_id}`;

    res.status(200).json({
      success: true,
      paymentLink,
      orderId: orderResponse.data.order_id,
      cfOrderId: orderResponse.data.cf_order_id,
    });
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      response: error.response?.data,
      config: error.config,
    });

    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      details: error.response?.data || error.message,
    });
  }
}
