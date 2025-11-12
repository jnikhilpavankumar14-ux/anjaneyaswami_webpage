import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    const supabase = createServerClient()

    // Handle payment events
    if (event.event === 'payment.captured' || event.event === 'payment.failed') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id

      // Find donation by order ID
      const { data: donation, error: donationError } = await supabase
        .from('donations')
        .select('*')
        .eq('razorpay_order_id', orderId)
        .single()

      if (donationError || !donation) {
        console.error('Donation not found for order:', orderId)
        return NextResponse.json({ received: true })
      }

      // Update donation status
      const status = event.event === 'payment.captured' ? 'completed' : 'failed'
      
      await supabase
        .from('donations')
        .update({
          razorpay_payment_id: payment.id,
          status,
          completed_at: status === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', donation.id)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

