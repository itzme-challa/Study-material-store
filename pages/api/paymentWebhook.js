export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  console.log('Webhook received:', JSON.stringify(req.body, null, 2));

  const signature = req.headers['x-cf-signature'];
  const secret = process.env.CF_WEBHOOK_SECRET;

  // TODO: Implement signature verification here for production!

  const { orderId, orderAmount, referenceId, txStatus, paymentMode, cf_order_id } = req.body;

  try {
    // Example processing: verify payment status and update your DB or send product

    if (txStatus === 'SUCCESS') {
      console.log(`Payment SUCCESS for order ${orderId}, CF order id: ${cf_order_id}`);
      // TODO: Add your product delivery logic here
    } else {
      console.log(`Payment status: ${txStatus} for order ${orderId}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
