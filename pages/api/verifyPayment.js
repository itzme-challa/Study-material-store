import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId } = req.body;

  try {
    const response = await axios.get(
      `https://api.cashfree.com/pg/orders/${orderId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': '605266b66d4c81295df88e013e662506',
          'x-client-secret': 'cfsk_ma_prod_3d5c1e52a60832d47f1eb1af9045d1c2_4b948447',
          'x-api-version': '2022-09-01'
        }
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Cashfree verification error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}
