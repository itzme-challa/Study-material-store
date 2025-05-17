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
        notify_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paymentWebhook`,
        payment_methods: "card,upi,netbanking,wallet" // Explicitly specify payment methods
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

    // 2. Generate payment link directly without separate session creation
    const paymentLink = `https://payments.cashfree.com/order/#${orderResponse.data.cf_order_id}`;
    
    // 3. Verify the payment link is properly formed
    if (!paymentLink || !orderResponse.data.cf_order_id) {
      throw new Error('Failed to generate payment link');
    }

    res.status(200).json({
      success: true,
      paymentLink: paymentLink,
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
      },
      fallback: {
        upiId: 'eduhub@upi',
        contact: 'support@eduhub.com',
        whatsapp: 'https://wa.me/919999999999'
      }
    };

    res.status(error.response?.status || 500).json(errorResponse);
  }
}
