import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('puja_events')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(10)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch schedule' },
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

