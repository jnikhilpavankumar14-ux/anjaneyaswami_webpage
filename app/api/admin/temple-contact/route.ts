import { NextRequest, NextResponse } from 'next/server'
import { updateTempleContact } from '@/lib/admin'

export async function PUT(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    const { data, error } = await updateTempleContact(email, phone)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update contact' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

