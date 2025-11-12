import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      .update({ title, description, date, time })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update event' },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    
    const { error } = await supabase
      .from('puja_events')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete event' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

