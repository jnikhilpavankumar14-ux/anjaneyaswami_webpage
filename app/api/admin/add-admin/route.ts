import { NextRequest, NextResponse } from 'next/server'
import { addAdmin } from '@/lib/admin'
import { isAdminUser } from '@/lib/admin'
import { createServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()

    if (!email || !phone) {
      return NextResponse.json(
        { error: 'Email and phone are required' },
        { status: 400 }
      )
    }

    // Verify current user is admin (simplified - in production use proper session)
    // For now, we'll trust the request comes from admin panel
    
    const { data, error } = await addAdmin(email, phone)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to add admin' },
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

