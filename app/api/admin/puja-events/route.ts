import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { isAdminUser } from '@/lib/admin'

export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('puja_events')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch events' },
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

export async function POST(request: NextRequest) {
  try {
    const { title, description, date, time } = await request.json()

    if (!title || !description || !date || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('puja_events')
      .insert({
        title,
        description,
        date,
        time,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

