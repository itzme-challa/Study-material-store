import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Payment request received:', JSON.stringify(req.body, null, 2));

  const { productId, productName, amount, telegramLink } = req.body;

  // Validate required fields
  if (!productId || !productName || !amount || !telegramLink) {
    return res.status(400).json({ 
      success: false,
      error: 'Missing required fields',
      details: {
        missing: {
          productId: !productId,
          productName: !productName,
          amount: !amount,
          telegramLink: !telegramLink
        }
      }
    });
  }

  try {
    // 1. Create Cashfree Order
    const orderPayload = {
      order_id: `order_${productId}_${Date.now()}`,
      order_amount: amount,
      order_currency: 'INR',
      order_note: productName,
      customer_details: {
        customer_id: `cust_${Date.now()}`,
        customer_name: 'Study Material Customer',
        customer_email: 'customer@example.com',
        customer_phone: '9999999999'
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id={order_id}&telegram_link=${encodeURIComponent(telegramLink)}`,
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paymentWebhook`
      }
    };

    const orderResponse = await axios.post(
      'https://api.cashfree.com/pg/orders',
      orderPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_APP_ID,
          'x-client-secret': process.env.CF_SECRET_KEY,
          'x-api-version': '2022-09-01'
        },
        timeout: 10000
      }
    );

    console.log('Order created:', orderResponse.data.order_id);

    // 2. Create Payment Session with all methods
    const sessionPayload = {
      payment_session_id: orderResponse.data.payment_session_id,
      payment_method: {
        card: { channel: "link" },
        upi: { channel: "link" },
        netbanking: { channel: "link" },
        wallet: { channel: "link" },
        app: { provider: "googlepay" }
      },
      order_tags: {
        product_id: productId,
        product_name: productName
      }
    };

    const sessionResponse = await axios.post(
      `https://api.cashfree.com/pg/orders/${orderResponse.data.order_id}/payments`,
      sessionPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': process.env.CF_APP_ID,
          'x-client-secret': process.env.CF_SECRET_KEY,
          'x-api-version': '2022-09-01'
        },
        timeout: 10000
      }
    );

    // 3. Verify payment session was created
    if (!sessionResponse.data?.payments?.url) {
      throw new Error('Payment session creation failed - no payment URL returned');
    }

    console.log('Payment session created:', sessionResponse.data.payments.url);

    // 4. Return payment link to frontend
    res.status(200).json({
      success: true,
      paymentLink: `https://payments.cashfree.com/order/#${orderResponse.data.cf_order_id}`,
      orderId: orderResponse.data.order_id,
      cfOrderId: orderResponse.data.cf_order_id,
      sessionId: orderResponse.data.payment_session_id
    });

  } catch (error) {
    console.error('Payment processing error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    const errorResponse = {
      success: false,
      error: 'Payment processing failed',
      details: {
        message: error.message,
        code: error.response?.status,
        data: error.response?.data
      }
    };

    // Special handling for common errors
    if (error.response) {
      if (error.response.status === 401) {
        errorResponse.error = 'Authentication failed - check API credentials';
      } else if (error.response.status === 400) {
        errorResponse.error = 'Invalid request data';
      }
    }

    res.status(error.response?.status || 500).json(errorResponse);
  }
}
