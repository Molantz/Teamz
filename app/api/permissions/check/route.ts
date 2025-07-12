import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { role, resource, action } = body

    // Validate required fields
    if (!role || !resource || !action) {
      return NextResponse.json(
        { error: 'Role, resource, and action are required' },
        { status: 400 }
      )
    }

    // Check if the permission exists and is granted
    const { data, error } = await supabase
      .from('permissions')
      .select('granted')
      .eq('role', role)
      .eq('resource', resource)
      .eq('action', action)
      .single()

    if (error) {
      console.error('Error checking permission:', error)
      return NextResponse.json(
        { error: 'Failed to check permission' },
        { status: 500 }
      )
    }

    const granted = data?.granted || false

    return NextResponse.json({ granted })
  } catch (error) {
    console.error('Error in permission check POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 