import { NextRequest, NextResponse } from 'next/server'
import { isAdminUser } from '@/lib/admin'

export async function POST(request: NextRequest) {
  try {
    const { email, phone } = await request.json()
    
    const admin = await isAdminUser(email, phone)
    
    return NextResponse.json({ isAdmin: admin })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

