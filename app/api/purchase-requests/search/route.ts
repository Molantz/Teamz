import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract search parameters
    const prNumber = searchParams.get('pr_number')
    const requesterId = searchParams.get('requester_id')
    const requesterName = searchParams.get('requester_name')
    const status = searchParams.getAll('status')
    const category = searchParams.getAll('category')
    const dateFrom = searchParams.get('date_from')
    const dateTo = searchParams.get('date_to')
    const assignedTo = searchParams.get('assigned_to')
    const departmentId = searchParams.get('department_id')
    const hasIncompleteInfo = searchParams.get('has_incomplete_info')
    const isDelivered = searchParams.get('is_delivered')

    let query = supabase
      .from('purchase_requests')
      .select(`
        *,
        pr_items (*),
        departments (name)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (prNumber) {
      query = query.ilike('pr_number', `%${prNumber}%`)
    }

    if (requesterId) {
      query = query.eq('requester_id', requesterId)
    }

    if (requesterName) {
      query = query.ilike('requester_name', `%${requesterName}%`)
    }

    if (status.length > 0) {
      query = query.in('status', status)
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom)
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo)
    }

    if (assignedTo) {
      query = query.eq('assigned_to', assignedTo)
    }

    if (departmentId) {
      query = query.eq('department_id', departmentId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching purchase requests:', error)
      return NextResponse.json(
        { error: 'Failed to search purchase requests' },
        { status: 500 }
      )
    }

    // Apply additional filters that require post-processing
    let filteredData = data || []

    // Filter by category (requires checking PR items)
    if (category.length > 0) {
      filteredData = filteredData.filter(pr => 
        pr.pr_items?.some((item: any) => category.includes(item.category))
      )
    }

    // Filter by incomplete information
    if (hasIncompleteInfo === 'true') {
      filteredData = filteredData.filter(pr => 
        !pr.description || !pr.requester_name || !pr.total_amount
      )
    }

    // Filter by delivery status
    if (isDelivered === 'true') {
      filteredData = filteredData.filter(pr => 
        pr.pr_items?.some((item: any) => item.delivered_at)
      )
    } else if (isDelivered === 'false') {
      filteredData = filteredData.filter(pr => 
        !pr.pr_items?.some((item: any) => item.delivered_at)
      )
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    console.error('Error in purchase requests search:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 