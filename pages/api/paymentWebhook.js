import { buffer } from 'micro';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Disables Next.js default JSON body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = (await buffer(req)).toString(); // Get raw body as string
    const signature = req.headers['x-webhook-signature'];
    const secret = process.env.CF_WEBHOOK_SECRET;

    // Verify signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    if (expectedSignature !== signature) {
      console.error('Signature mismatch!');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const payload = JSON.parse(rawBody);
    const { data, type } = payload;

    const orderId = data?.order?.order_id;
    const paymentStatus = data?.payment?.payment_status;
    const paymentAmount = data?.payment?.payment_amount;

    console.log(`Webhook type: ${type}`);
    console.log(`Payment ${paymentStatus} for order ${orderId} with amount ${paymentAmount}`);

    // TODO: Process order (e.g., update DB, send product)

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}
