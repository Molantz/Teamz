import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const prId = params.id

    if (!prId) {
      return NextResponse.json(
        { error: 'PR ID is required' },
        { status: 400 }
      )
    }

    // Fetch PR with all related data
    const { data: prData, error: prError } = await supabase
      .from('purchase_requests')
      .select(`
        *,
        pr_items (
          *,
          assignment_actions (*)
        ),
        pr_status_history (*),
        pr_approvals (*),
        pr_comments (*),
        pr_attachments (*),
        departments (name)
      `)
      .eq('id', prId)
      .single()

    if (prError) {
      console.error('Error fetching PR details:', prError)
      return NextResponse.json(
        { error: 'Failed to fetch PR details' },
        { status: 500 }
      )
    }

    if (!prData) {
      return NextResponse.json(
        { error: 'PR not found' },
        { status: 404 }
      )
    }

    // Fetch notifications for this PR
    const { data: notifications } = await supabase
      .from('notifications')
      .select('*')
      .eq('related_id', prId)
      .order('created_at', { ascending: false })

    // Fetch assignment actions for all PR items
    const prItemIds = prData.pr_items?.map((item: any) => item.id) || []
    let assignmentActions: any[] = []
    
    if (prItemIds.length > 0) {
      const { data: actions } = await supabase
        .from('assignment_actions')
        .select('*')
        .in('pr_item_id', prItemIds)
        .order('assigned_at', { ascending: false })
      
      assignmentActions = actions || []
    }

    // Structure the response
    const prDetails = {
      ...prData,
      notifications: notifications || [],
      assignment_actions: assignmentActions
    }

    return NextResponse.json(prDetails)
  } catch (error) {
    console.error('Error in PR details GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 