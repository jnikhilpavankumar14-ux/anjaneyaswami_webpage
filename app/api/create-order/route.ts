import { NextRequest, NextResponse } from 'next/server'
import { createRazorpayOrder } from '@/lib/razorpay'
import { createServerClient } from '@/lib/supabase'
import { getAuthenticatedUser } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { amount, note } = await request.json()

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Verify user is authenticated
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    
    // Get or create donor record
    const { data: donor, error: donorError } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (donorError && donorError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Failed to fetch donor' },
        { status: 500 }
      )
    }

    let donorId = donor?.id

    if (!donorId) {
      // Create donor record
      const { data: newDonor, error: createError } = await supabase
        .from('donors')
        .insert({
          user_id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Donor',
          verified: true,
        })
        .select()
        .single()

      if (createError) {
        return NextResponse.json(
          { error: 'Failed to create donor' },
          { status: 500 }
        )
      }

      donorId = newDonor.id
    }

    // Create Razorpay order
    const order = await createRazorpayOrder({
      amount,
      receipt: `donation_${donorId}_${Date.now()}`,
    })

    // Save donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        donor_id: donorId,
        amount,
        razorpay_order_id: order.id,
        status: 'pending',
        note: note || null,
      })
      .select()
      .single()

    if (donationError) {
      return NextResponse.json(
        { error: 'Failed to create donation record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount / 100,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      donationId: donation.id,
    })
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

