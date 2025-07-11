// Authentication and authorization utilities

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'manager' | 'employee' | 'technician' | 'supervisor'
  department: string
  status: 'active' | 'inactive'
  permissions: string[]
  avatar?: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Mock user data for demonstration
const mockUsers: User[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    department: 'IT',
    status: 'active',
    permissions: ['users:read', 'users:write', 'devices:read', 'devices:write', 'incidents:read', 'incidents:write', 'reports:read', 'settings:read', 'settings:write'],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'manager',
    department: 'HR',
    status: 'active',
    permissions: ['users:read', 'devices:read', 'incidents:read', 'reports:read'],
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike.wilson@company.com',
    role: 'technician',
    department: 'IT',
    status: 'active',
    permissions: ['devices:read', 'devices:write', 'incidents:read', 'incidents:write'],
  },
  {
    id: 4,
    name: 'Laurian Lawrence',
    email: 'laurianlawrence@hesu.co.tz',
    role: 'supervisor',
    department: 'Management',
    status: 'active',
    permissions: ['users:read', 'users:write', 'devices:read', 'devices:write', 'incidents:read', 'incidents:write', 'reports:read', 'reports:write', 'projects:read', 'projects:write', 'departments:read', 'departments:write'],
  },
]

// Authentication functions
export const auth = {
  // Login function
  login: async (email: string, password: string): Promise<User | null> => {
    // Mock authentication - in real app, this would call your auth API
    const user = mockUsers.find(u => u.email === email)
    if (user && password === '1809') { // Updated password for supervisor
      // Store user in localStorage for session persistence
      localStorage.setItem('user', JSON.stringify(user))
      return user
    }
    return null
  },

  // Logout function
  logout: (): void => {
    localStorage.removeItem('user')
  },

  // Get current user
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!auth.getCurrentUser()
  },

  // Check if user has specific permission
  hasPermission: (permission: string): boolean => {
    const user = auth.getCurrentUser()
    return user ? user.permissions.includes(permission) : false
  },

  // Check if user has any of the specified permissions
  hasAnyPermission: (permissions: string[]): boolean => {
    const user = auth.getCurrentUser()
    return user ? permissions.some(permission => user.permissions.includes(permission)) : false
  },

  // Check if user has all of the specified permissions
  hasAllPermissions: (permissions: string[]): boolean => {
    const user = auth.getCurrentUser()
    return user ? permissions.every(permission => user.permissions.includes(permission)) : false
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const user = auth.getCurrentUser()
    return user ? user.role === role : false
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles: string[]): boolean => {
    const user = auth.getCurrentUser()
    return user ? roles.includes(user.role) : false
  },
}

// Permission constants
export const PERMISSIONS = {
  // User permissions
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',
  
  // Device permissions
  DEVICES_READ: 'devices:read',
  DEVICES_WRITE: 'devices:write',
  DEVICES_DELETE: 'devices:delete',
  
  // Incident permissions
  INCIDENTS_READ: 'incidents:read',
  INCIDENTS_WRITE: 'incidents:write',
  INCIDENTS_DELETE: 'incidents:delete',
  
  // Request permissions
  REQUESTS_READ: 'requests:read',
  REQUESTS_WRITE: 'requests:write',
  REQUESTS_DELETE: 'requests:delete',
  
  // Project permissions
  PROJECTS_READ: 'projects:read',
  PROJECTS_WRITE: 'projects:write',
  PROJECTS_DELETE: 'projects:delete',
  
  // Department permissions
  DEPARTMENTS_READ: 'departments:read',
  DEPARTMENTS_WRITE: 'departments:write',
  DEPARTMENTS_DELETE: 'departments:delete',
  
  // Report permissions
  REPORTS_READ: 'reports:read',
  REPORTS_WRITE: 'reports:write',
  
  // Settings permissions
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',
}

// Role constants
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
  TECHNICIAN: 'technician',
  SUPERVISOR: 'supervisor',
} 