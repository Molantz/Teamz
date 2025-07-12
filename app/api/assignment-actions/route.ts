import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prItemId = searchParams.get('pr_item_id')

    let query = supabase
      .from('assignment_actions')
      .select('*')
      .order('assigned_at', { ascending: false })

    if (prItemId) {
      query = query.eq('pr_item_id', prItemId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching assignment actions:', error)
      return NextResponse.json({ error: 'Failed to fetch assignment actions' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in assignment actions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pr_item_id, action_type, target_id, assigned_by, notes } = body

    // Validate required fields
    if (!pr_item_id || !action_type || !target_id || !assigned_by) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate action type
    const validActionTypes = ['assign_to_inventory', 'assign_to_user', 'assign_to_department']
    if (!validActionTypes.includes(action_type)) {
      return NextResponse.json(
        { error: 'Invalid action type' },
        { status: 400 }
      )
    }

    const assignmentAction = {
      pr_item_id,
      action_type,
      target_id,
      assigned_by,
      notes,
      assigned_at: new Date().toISOString(),
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('assignment_actions')
      .insert([assignmentAction])
      .select()
      .single()

    if (error) {
      console.error('Error creating assignment action:', error)
      return NextResponse.json(
        { error: 'Failed to create assignment action' },
        { status: 500 }
      )
    }

    // Update PR item status if assignment is successful
    if (data) {
      await supabase
        .from('pr_items')
        .update({ 
          assigned_at: new Date().toISOString(),
          status: 'assigned'
        })
        .eq('id', pr_item_id)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in assignment actions POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 