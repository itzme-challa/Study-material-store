export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { orderId, status, productLink } = req.body;

  try {
    // In a real application, you would:
    // 1. Save this to your database
    // 2. Maybe send a confirmation email
    // 3. Log the transaction for analytics
    
    console.log(`Tracking payment: Order ${orderId} - Status ${status}`);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Payment tracking error:', error);
    res.status(500).json({ error: 'Failed to track payment' });
  }
}
