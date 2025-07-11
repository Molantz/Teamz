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
