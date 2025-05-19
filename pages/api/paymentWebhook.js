import { buffer } from 'micro';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const rawBody = (await buffer(req)).toString();
    const signature = req.headers['x-webhook-signature'];
    const secret = process.env.CF_WEBHOOK_SECRET;

    // Signature validation
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    if (signature !== expectedSignature) {
      console.error('Invalid signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse body only after verifying signature
    const payload = JSON.parse(rawBody);

    const { data, type } = payload;
    const orderId = data?.order?.order_id;
    const amount = data?.payment?.payment_amount;
    const status = data?.payment?.payment_status;

    console.log(`Received ${type} for order ${orderId} with status ${status} and amount ${amount}`);

    // TODO: Add your logic here (e.g., DB update, send product)

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
