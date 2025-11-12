import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export interface CreateOrderParams {
  amount: number
  currency?: string
  receipt?: string
}

export async function createRazorpayOrder(params: CreateOrderParams) {
  const options = {
    amount: params.amount * 100, // Convert to paise
    currency: params.currency || 'INR',
    receipt: params.receipt || `receipt_${Date.now()}`,
  }

  return await razorpay.orders.create(options)
}

export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(orderId + '|' + paymentId)
    .digest('hex')

  return generatedSignature === signature
}

