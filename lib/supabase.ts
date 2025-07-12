import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  last_login?: string
  avatar?: string
  phone?: string
  position?: string
  employee_id?: string
  join_date?: string
  signature?: string
  created_at: string
  updated_at: string
}

export interface Asset {
  id: string
  name: string
  type: string
  model?: string
  serial_number?: string
  manufacturer?: string
  purchase_date?: string
  purchase_price?: number
  warranty_expiry?: string
  location: string
  status: string
  assigned_to?: string
  notes?: string
  specifications?: string
  created_at: string
  updated_at: string
}

export interface Incident {
  id: string
  title: string
  category: string
  priority: string
  description: string
  affected_user?: string
  affected_device?: string
  department?: string
  contact_email?: string
  contact_phone?: string
  steps_to_reproduce?: string
  expected_behavior?: string
  actual_behavior?: string
  status: string
  assignee?: string
  created_at: string
  updated_at: string
}

export interface Request {
  id: string
  title: string
  type: string
  priority: string
  description: string
  requester?: string
  department?: string
  budget?: number
  expected_delivery?: string
  justification: string
  impact?: string
  alternatives?: string
  attachments?: string
  status: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
}

export interface Assignment {
  id: string
  device_id: string
  user_id: string
  assignment_type: string
  assignment_date: string
  expected_return_date?: string
  reason: string
  notes?: string
  terms?: string
  supervisor?: string
  status: string
  created_at: string
  updated_at: string
}

export interface Department {
  id: string
  name: string
  code: string
  manager_id?: string
  budget?: number
  location?: string
  description?: string
  created_at: string
  updated_at: string
} 