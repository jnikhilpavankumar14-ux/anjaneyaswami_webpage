import { NextRequest, NextResponse } from 'next/server'
import { verifyPaymentSignature } from '@/lib/razorpay'
import { createServerClient } from '@/lib/supabase'
import { generateReceiptPDF, generateReceiptHTML } from '@/lib/receipt'

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = await request.json()

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()

    // Get donation record
    const { data: donation, error: donationError } = await supabase
      .from('donations')
      .select(`
        *,
        donors (
          name,
          email,
          phone
        )
      `)
      .eq('id', donationId)
      .single()

    if (donationError || !donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      )
    }

    // Update donation status
    const { error: updateError } = await supabase
      .from('donations')
      .update({
        razorpay_payment_id,
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', donationId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update donation' },
        { status: 500 }
      )
    }

    // Generate receipt
    const donor = donation.donors as any
    const receiptData = {
      donorName: donor?.name || 'Donor',
      amount: donation.amount,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      date: new Date().toLocaleDateString('en-IN'),
      note: donation.note || undefined,
    }

    const pdfDoc = generateReceiptPDF(receiptData)
    const pdfBlob = pdfDoc.output('blob')
    const pdfBuffer = Buffer.from(await pdfBlob.arrayBuffer())

    // Upload receipt to storage
    const receiptFileName = `receipts/${donationId}_${Date.now()}.pdf`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(receiptFileName, pdfBuffer, {
        contentType: 'application/pdf',
      })

    let receiptUrl = null
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('receipts')
        .getPublicUrl(receiptFileName)
      receiptUrl = urlData.publicUrl

      // Update donation with receipt URL
      await supabase
        .from('donations')
        .update({ receipt_url: receiptUrl })
        .eq('id', donationId)
    }

    // Send email receipt (if email service is configured)
    const htmlReceipt = generateReceiptHTML(receiptData)
    // TODO: Integrate email service (SendGrid, Resend, etc.)

    return NextResponse.json({
      success: true,
      receiptUrl,
      donation: {
        id: donation.id,
        amount: donation.amount,
        paymentId: razorpay_payment_id,
        status: 'completed',
      },
    })
  } catch (error: any) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

