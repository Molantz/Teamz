export interface User {
  id: string
  name: string
  email: string
  role: "Admin" | "Manager" | "Technician" | "Developer" | "Intern"
  department: string
  status: "Active" | "Inactive" | "Suspended"
  avatar?: string
  phone?: string
  joinDate: string
  lastLogin?: string
}

export interface InventoryItem {
  id: string
  name: string
  category: string
  quantity: number
  available: number
  assigned: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  location: string
  cost: string
  supplier: string
  serialNumber?: string
  purchaseDate?: string
  warrantyExpiry?: string
}

export interface Incident {
  id: string
  title: string
  description: string
  status: "New" | "In Progress" | "Resolved" | "Closed"
  priority: "Low" | "Medium" | "High" | "Critical"
  category: string
  assignee?: User
  reporter: string
  created: string
  updated: string
  affectedUsers: number
  resolution?: string
  attachments?: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  status: "Planned" | "Ongoing" | "Completed" | "On Hold"
  priority: "Low" | "Medium" | "High"
  startDate: string
  endDate?: string
  budget: number
  teamMembers: User[]
  assignedAssets: InventoryItem[]
  progress: number
}

export interface Request {
  id: string
  title: string
  description: string
  type: "Hardware" | "Software" | "Access" | "Support"
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled"
  priority: "Low" | "Medium" | "High"
  requester: User
  approver?: User
  created: string
  updated: string
  justification: string
  estimatedCost?: number
}

// PR (Purchase Request) Types
export type PRStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'in_progress' | 'delivered' | 'completed' | 'cancelled';
export type UserRole = "Admin" | "Manager" | "Technician" | "Developer" | "Intern" | "Info & Data Analyst Officer";

export interface PurchaseRequest {
  id: string;
  pr_number: string;
  title: string;
  description: string;
  requester_id: string;
  requester_name: string;
  department_id?: string;
  assigned_to?: string;
  status: PRStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  total_amount: number;
  created_at: Date;
  updated_at: Date;
  due_date?: Date;
  notes?: string;
}

export interface PRItem {
  id: string;
  pr_id: string;
  name: string;
  description: string;
  category: 'device' | 'software' | 'consumable' | 'service' | 'other';
  quantity: number;
  unit_price: number;
  total_price: number;
  status: PRStatus;
  delivered_at?: Date;
  assigned_at?: Date;
  notes?: string;
}

export interface PRStatusHistory {
  id: string;
  pr_id: string;
  status: PRStatus;
  changed_by: string;
  changed_at: Date;
  remarks?: string;
}

export interface PRApproval {
  id: string;
  pr_id: string;
  approver_id: string;
  approver_name: string;
  status: 'approved' | 'rejected';
  approved_at: Date;
  remarks?: string;
}

export interface PRComment {
  id: string;
  pr_id: string;
  user_id: string;
  user_name: string;
  comment: string;
  created_at: Date;
}

export interface PRAttachment {
  id: string;
  pr_id: string;
  filename: string;
  file_url: string;
  file_size: number;
  uploaded_by: string;
  uploaded_at: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  manager_id?: string;
  budget: number;
  budget_utilized: number;
  status: 'active' | 'inactive';
  created_at: Date;
  updated_at: Date;
}

// Assignment Actions
export interface AssignmentAction {
  id: string;
  pr_item_id: string;
  action_type: 'assign_to_inventory' | 'assign_to_user' | 'assign_to_department';
  target_id: string; // inventory_id, user_id, or department_id
  assigned_by: string;
  assigned_at: Date;
  notes?: string;
  status: 'pending' | 'completed' | 'failed';
}

// Enhanced Notification System
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'pr_status' | 'pr_approval' | 'pr_assignment' | 'pr_delivery' | 'pr_incomplete';
  related_id?: string; // pr_id, pr_item_id, etc.
  read: boolean;
  created_at: Date;
  action_url?: string;
}

export interface NotificationSettings {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  pr_status_updates: boolean;
  pr_approvals: boolean;
  pr_assignments: boolean;
  pr_deliveries: boolean;
  pr_incomplete_info: boolean;
}

// Enhanced PR Search and Filter
export interface PRSearchFilters {
  pr_number?: string;
  requester_id?: string;
  requester_name?: string;
  status?: PRStatus[];
  category?: string[];
  date_from?: Date;
  date_to?: Date;
  assigned_to?: string;
  department_id?: string;
  has_incomplete_info?: boolean;
  is_delivered?: boolean;
}

// Detailed PR View
export interface PRDetails extends PurchaseRequest {
  items: PRItemWithDetails[];
  status_history: PRStatusHistory[];
  approvals: PRApproval[];
  notifications: Notification[];
  comments: PRComment[];
  attachments: PRAttachment[];
  assignment_actions: AssignmentAction[];
}

export interface PRItemWithDetails extends PRItem {
  assignment_actions: AssignmentAction[];
  inventory_item?: InventoryItem;
  assigned_user?: User;
  assigned_department?: Department;
}

// Role-based Permissions
export interface Permission {
  id: string;
  role: UserRole;
  resource: string; // 'pr', 'inventory', 'departments', etc.
  action: string; // 'create', 'read', 'update', 'delete', 'approve', 'assign'
  granted: boolean;
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}

// Export Options
export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'excel'
  filters: PRSearchFilters | Record<string, any>
  include_details: boolean
  date_range?: {
    from: Date
    to: Date
  }
  columns?: string[]
}

// Advanced Alerts System Types
export interface Alert {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error' | 'critical'
  category: 'system' | 'security' | 'performance' | 'maintenance' | 'user' | 'device'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
  assigned_to?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  metadata?: Record<string, any>
  created_at: Date
  updated_at: Date
}

export interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: AlertCondition[]
  actions: AlertAction[]
  created_at: Date
  updated_at: Date
}

export interface AlertCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex'
  value: string
}

export interface AlertAction {
  type: 'notification' | 'email' | 'webhook' | 'escalation'
  config: Record<string, any>
}

// Real-time Dashboard Types
export interface DashboardMetric {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: string
  description?: string
}

export interface SystemStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  uptime: number
  responseTime: number
  lastCheck: Date
}

export interface PerformanceMetric {
  cpu: number
  memory: number
  disk: number
  network: number
  timestamp: Date
}

// Bulk Operations Types
export interface BulkItem {
  id: string
  name: string
  status: string
  type: string
  selected: boolean
}

export interface BulkOperation {
  action: string
  selectedIds: string[]
  data?: any
  timestamp: Date
  user_id: string
  status: 'pending' | 'completed' | 'failed'
  results?: any[]
}

// Audit Trail Types
export interface AuditLog {
  id: string
  timestamp: Date
  user_id: string
  user_name: string
  action: string
  resource_type: string
  resource_id: string
  resource_name: string
  details: string
  ip_address: string
  user_agent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'user_action' | 'system_event' | 'security_event' | 'data_change' | 'access_control'
  metadata?: Record<string, any>
  created_at: Date
}

export interface AuditFilter {
  user_id?: string
  action?: string
  severity?: string
  category?: string
  date_from?: Date
  date_to?: Date
  resource_type?: string
  resource_id?: string
}

// Advanced Search Types
export interface SearchFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'between' | 'is_null' | 'is_not_null'
  value: any
  label: string
}

export interface AdvancedSearchOptions {
  table: string
  filters: SearchFilter[]
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Export Types
export interface ExportOptions {
  format: 'csv' | 'json' | 'pdf' | 'excel'
  filters: PRSearchFilters | Record<string, any>
  include_details: boolean
  date_range?: {
    from: Date
    to: Date
  }
  columns?: string[]
}

// Real-time Activity Types
export interface ActivityLog {
  id: string
  user_id: string
  user_name: string
  action: string
  resource_type: string
  resource_id: string
  resource_name: string
  details: string
  timestamp: Date
  metadata?: Record<string, any>
}

// Notification Settings Types
export interface NotificationSettings {
  id: string
  user_id: string
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
  alert_notifications: boolean
  system_notifications: boolean
  quiet_hours: {
    enabled: boolean
    start: string
    end: string
  }
  categories: {
    incidents: boolean
    requests: boolean
    approvals: boolean
    system: boolean
    security: boolean
  }
  created_at: Date
  updated_at: Date
}

// Role Permissions Types
export interface RolePermissions {
  id: string
  role: UserRole
  permissions: Permission[]
  created_at: Date
  updated_at: Date
}

export interface Permission {
  id: string
  role_id: string
  resource: string
  action: string
  granted: boolean
  conditions?: Record<string, any>
  created_at: Date
  updated_at: Date
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'list' | 'status'
  title: string
  config: Record<string, any>
  position: {
    x: number
    y: number
    width: number
    height: number
  }
  user_id: string
  created_at: Date
  updated_at: Date
}

// System Health Types
export interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical'
  services: ServiceStatus[]
  metrics: SystemMetrics
  last_check: Date
}

export interface ServiceStatus {
  name: string
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  response_time: number
  uptime: number
  last_check: Date
}

export interface SystemMetrics {
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  network_io: number
  active_connections: number
  error_rate: number
}
