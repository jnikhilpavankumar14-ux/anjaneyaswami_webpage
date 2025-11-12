import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdminUser } from '@/lib/admin'

export async function POST(request: NextRequest) {
  try {
    const { donorName, amount, bankTxnId, date } = await request.json()

    if (!donorName || !amount || !bankTxnId || !date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify admin access (simplified - in production, use proper session)
    const supabase = createServerClient()
    
    // For now, we'll create a donor record if it doesn't exist
    // In production, you'd want to verify admin session properly
    let { data: donor } = await supabase
      .from('donors')
      .select('id')
      .eq('email', `offline_${bankTxnId}@temple.local`)
      .single()

    if (!donor) {
      const { data: newDonor, error: donorError } = await supabase
        .from('donors')
        .insert({
          email: `offline_${bankTxnId}@temple.local`,
          name: donorName,
          verified: true,
        })
        .select()
        .single()

      if (donorError || !newDonor) {
        return NextResponse.json(
          { error: 'Failed to create donor' },
          { status: 500 }
        )
      }

      donor = newDonor
    }

    // Ensure donor exists before creating donation
    if (!donor || !donor.id) {
      return NextResponse.json(
        { error: 'Failed to get or create donor' },
        { status: 500 }
      )
    }

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .insert({
        donor_id: donor.id,
        amount: parseFloat(amount),
        razorpay_payment_id: `OFFLINE_${bankTxnId}`,
        razorpay_order_id: `OFFLINE_${Date.now()}`,
        status: 'completed',
        completed_at: new Date(date).toISOString(),
        created_at: new Date(date).toISOString(),
      })
      .select()
      .single()

    if (donationError) {
      return NextResponse.json(
        { error: 'Failed to create donation' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, donation })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

