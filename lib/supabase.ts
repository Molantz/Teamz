import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

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
  budget_utilization?: number
  location?: string
  description?: string
  status?: string
  parent_department_id?: string
  level?: number
  employee_count?: number
  device_count?: number
  created_at: string
  updated_at: string
}

export interface DepartmentBudgetHistory {
  id: string
  department_id: string
  fiscal_year: string
  budget_amount: number
  spent_amount: number
  utilization_percentage: number
  notes?: string
  created_by: string
  created_at: string
}

export interface DepartmentResource {
  id: string
  department_id: string
  resource_type: string
  resource_id?: string
  resource_name: string
  quantity: number
  cost_per_unit?: number
  total_cost?: number
  assigned_date: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface DepartmentActivity {
  id: string
  department_id: string
  activity_type: string
  title: string
  description?: string
  start_date?: string
  end_date?: string
  start_time?: string
  end_time?: string
  location?: string
  attendees?: string[]
  status: string
  priority: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface DepartmentGoal {
  id: string
  department_id: string
  goal_type: string
  title: string
  description?: string
  target_value?: number
  current_value?: number
  unit?: string
  target_date?: string
  status: string
  progress_percentage?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface DepartmentDocument {
  id: string
  department_id: string
  document_type: string
  title: string
  description?: string
  file_url: string
  file_size?: number
  mime_type?: string
  version: string
  status: string
  expiry_date?: string
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface DepartmentCommunication {
  id: string
  department_id: string
  channel_type: string
  channel_name: string
  channel_url?: string
  description?: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface DepartmentWorkflow {
  id: string
  department_id: string
  workflow_name: string
  workflow_type: string
  description?: string
  steps: any[]
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface DepartmentIntegration {
  id: string
  department_id: string
  integration_type: string
  integration_name: string
  api_endpoint?: string
  api_key_hash?: string
  configuration?: any
  is_active: boolean
  last_sync?: string
  created_by: string
  created_at: string
  updated_at: string
}

// PR Management Interfaces
export interface PurchaseRequest {
  id: string
  pr_number: string
  title: string
  description?: string
  requester_id: string
  assigned_to_id?: string
  department_id?: string
  priority: string
  status: string
  total_estimated_cost?: number
  total_actual_cost?: number
  currency: string
  expected_delivery_date?: string
  actual_delivery_date?: string
  remarks?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
  submitted_at?: string
  approved_at?: string
  delivered_at?: string
}

export interface PRItem {
  id: string
  pr_id: string
  item_name: string
  description?: string
  category: string
  subcategory?: string
  quantity: number
  unit_price?: number
  total_price?: number
  supplier?: string
  model_number?: string
  specifications?: any
  status: string
  delivery_status: string
  inventory_item_id?: string
  assigned_to_employee_id?: string
  remarks?: string
  created_at: string
  updated_at: string
}

export interface PRStatusHistory {
  id: string
  pr_id: string
  status: string
  remarks?: string
  changed_by: string
  changed_at: string
  previous_status?: string
  next_status?: string
}

export interface PRApproval {
  id: string
  pr_id: string
  approver_id: string
  approval_level: number
  status: string
  remarks?: string
  approved_at?: string
  created_at: string
}

export interface PRNotification {
  id: string
  pr_id: string
  notification_type: string
  recipient_id: string
  title: string
  message: string
  is_read: boolean
  sent_at: string
  read_at?: string
}

export interface PRAttachment {
  id: string
  pr_id: string
  file_name: string
  file_url: string
  file_size?: number
  mime_type?: string
  uploaded_by: string
  uploaded_at: string
}

export interface PRComment {
  id: string
  pr_id: string
  commenter_id: string
  comment: string
  is_internal: boolean
  created_at: string
}

export interface Project {
  id: string
  name: string
  description?: string
  status: string
  priority: string
  progress?: number
  budget?: number
  spent?: number
  start_date?: string
  end_date?: string
  manager_id?: string
  team_size?: number
  tasks_completed?: number
  total_tasks?: number
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  report_id: string
  name: string
  type: string
  category?: string
  frequency?: string
  parameters?: any
  recipients?: string[]
  schedule_time?: string
  schedule_day?: number
  is_active: boolean
  created_by: string
  last_generated?: string
  next_generation?: string
  created_at: string
  updated_at: string
}

export interface AirtimeBundle {
  id: string
  name: string
  type: string
  provider: string
  data_limit: string
  data_used: string
  voice_minutes?: number
  voice_used?: number
  validity: string
  cost: string
  status: string
  assigned_to?: string
  assigned_to_name?: string
  phone_number?: string
  expiry_date?: string
  auto_renew: boolean
  created_at: string
  updated_at: string
} 