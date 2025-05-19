export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  // Verify the webhook signature
  const signature = req.headers['x-cf-signature'];
  const secret = process.env.CF_WEBHOOK_SECRET; // Set this in your env
  
  // In production, you should verify the signature here
  // For now we'll just log the data

  const { orderId, orderAmount, referenceId, txStatus, paymentMode } = req.body;

  try {
    // Here you would typically:
    // 1. Verify the payment
    // 2. Update your database
    // 3. Send the product to the user
    
    console.log(`Payment ${txStatus} for order ${orderId}`);
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
