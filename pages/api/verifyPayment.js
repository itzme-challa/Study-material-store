import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const response = await axios.get(
      `https://api.cashfree.com/pg/orders/${orderId}`,
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

    console.log('Payment verification response:', response.data);
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Verification error:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Failed to verify payment',
      details: error.response?.data || error.message
    });
  }
}
