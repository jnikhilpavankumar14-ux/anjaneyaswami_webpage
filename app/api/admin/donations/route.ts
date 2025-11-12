import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdminUser } from '@/lib/admin'

export async function GET(request: NextRequest) {
  try {
    // Verify admin access via session
    // Note: In production, you should use proper session handling
    // For now, we'll check via the check-admin endpoint pattern
    const supabase = createServerClient()
    
    // Get session from request headers or cookies
    // This is a simplified version - in production use proper auth middleware
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Extract token and verify
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = await isAdminUser(user.email, user.phone)
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch donations with donor info
    const { data, error } = await supabase
      .from('donations')
      .select(`
        *,
        donors (
          name,
          email,
          phone
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch donations' },
        { status: 500 }
      )
    }

    return NextResponse.json(data || [])
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

