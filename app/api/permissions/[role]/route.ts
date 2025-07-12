import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { role: string } }
) {
  try {
    const role = params.role

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      )
    }

    // Fetch permissions for the specified role
    const { data, error } = await supabase
      .from('permissions')
      .select('*')
      .eq('role', role)
      .order('resource', { ascending: true })

    if (error) {
      console.error('Error fetching role permissions:', error)
      return NextResponse.json(
        { error: 'Failed to fetch role permissions' },
        { status: 500 }
      )
    }

    const rolePermissions = {
      role,
      permissions: data || []
    }

    return NextResponse.json(rolePermissions)
  } catch (error) {
    console.error('Error in role permissions GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 