'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Unlock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { getRolePermissions, checkPermission, updatePermission } from '@/lib/api'
import type { UserRole, RolePermissions, Permission, User } from '@/lib/types'

interface RolePermissionsProps {
  currentUser: User
  onPermissionCheck?: (resource: string, action: string) => boolean
}

export function RolePermissions({ currentUser, onPermissionCheck }: RolePermissionsProps) {
  const [rolePermissions, setRolePermissions] = useState<RolePermissions | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role as UserRole)

  const resources = [
    { id: 'pr', name: 'Purchase Requests', description: 'Manage purchase requests and approvals' },
    { id: 'inventory', name: 'Inventory', description: 'Manage inventory items and assignments' },
    { id: 'departments', name: 'Departments', description: 'Manage departments and budgets' },
    { id: 'users', name: 'Users', description: 'Manage users and roles' },
    { id: 'incidents', name: 'Incidents', description: 'Manage incidents and tickets' },
    { id: 'reports', name: 'Reports', description: 'Generate and view reports' },
    { id: 'settings', name: 'Settings', description: 'System configuration and settings' }
  ]

  const actions = [
    { id: 'create', name: 'Create', description: 'Create new records' },
    { id: 'read', name: 'Read', description: 'View records and details' },
    { id: 'update', name: 'Update', description: 'Modify existing records' },
    { id: 'delete', name: 'Delete', description: 'Remove records' },
    { id: 'approve', name: 'Approve', description: 'Approve requests and changes' },
    { id: 'assign', name: 'Assign', description: 'Assign items and tasks' },
    { id: 'export', name: 'Export', description: 'Export data and reports' }
  ]

  useEffect(() => {
    if (isOpen) {
      loadRolePermissions()
    }
  }, [isOpen, selectedRole])

  const loadRolePermissions = async () => {
    setIsLoading(true)
    try {
      const permissions = await getRolePermissions(selectedRole)
      setRolePermissions(permissions)
    } catch (error) {
      console.error('Failed to load role permissions:', error)
      toast.error('Failed to load role permissions')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePermissionToggle = async (permission: Permission, granted: boolean) => {
    try {
      const updatedPermission = await updatePermission({
        ...permission,
        granted
      })
      
      setRolePermissions(prev => {
        if (!prev) return prev
        return {
          ...prev,
          permissions: prev.permissions.map(p => 
            p.id === permission.id ? updatedPermission : p
          )
        }
      })
      
      toast.success(`Permission ${granted ? 'granted' : 'revoked'} successfully`)
    } catch (error) {
      console.error('Failed to update permission:', error)
      toast.error('Failed to update permission')
    }
  }

  const checkUserPermission = async (resource: string, action: string): Promise<boolean> => {
    try {
      return await checkPermission(currentUser.role as UserRole, resource, action)
    } catch (error) {
      console.error('Failed to check permission:', error)
      return false
    }
  }

  const getPermissionStatus = (resource: string, action: string) => {
    if (!rolePermissions) return false
    return rolePermissions.permissions.some(p => 
      p.resource === resource && p.action === action && p.granted
    )
  }

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800'
      case 'Manager':
        return 'bg-blue-100 text-blue-800'
      case 'Info & Data Analyst Officer':
        return 'bg-purple-100 text-purple-800'
      case 'Technician':
        return 'bg-green-100 text-green-800'
      case 'Developer':
        return 'bg-indigo-100 text-indigo-800'
      case 'Intern':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'Full system access and control'
      case 'Manager':
        return 'Department management and oversight'
      case 'Info & Data Analyst Officer':
        return 'PR management and data analysis'
      case 'Technician':
        return 'Technical support and maintenance'
      case 'Developer':
        return 'System development and maintenance'
      case 'Intern':
        return 'Limited access for learning'
      default:
        return 'Standard user access'
    }
  }

  return (
    <>
      {/* Permission Check Component */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Role-Based Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Current Role: {currentUser.role}</h3>
                <p className="text-sm text-gray-600">{getRoleDescription(currentUser.role as UserRole)}</p>
              </div>
              <Badge className={getRoleColor(currentUser.role as UserRole)}>
                {currentUser.role}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <Card key={resource.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{resource.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {resource.id}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                  <div className="space-y-2">
                    {actions.map((action) => {
                      const hasPermission = getPermissionStatus(resource.id, action.id)
                      return (
                        <div key={action.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {hasPermission ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm">{action.name}</span>
                          </div>
                          <Badge 
                            variant={hasPermission ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {hasPermission ? 'Allowed' : 'Denied'}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Manage Permissions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Management Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Permission Management
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Role Selection */}
            <div>
              <Label htmlFor="role-select">Select Role</Label>
              <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Info & Data Analyst Officer">Info & Data Analyst Officer</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Intern">Intern</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">{getRoleDescription(selectedRole)}</p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading permissions...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {resources.map((resource) => (
                  <Card key={resource.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{resource.name}</span>
                        <Badge variant="outline">{resource.id}</Badge>
                      </CardTitle>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {actions.map((action) => {
                          const permission = rolePermissions?.permissions.find(p => 
                            p.resource === resource.id && p.action === action.id
                          )
                          const isGranted = permission?.granted || false

                          return (
                            <div key={action.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{action.name}</h4>
                                <p className="text-sm text-gray-600">{action.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={isGranted}
                                  onCheckedChange={(checked) => {
                                    if (permission) {
                                      handlePermissionToggle(permission, checked)
                                    }
                                  }}
                                />
                                <Badge variant={isGranted ? "default" : "secondary"}>
                                  {isGranted ? 'Granted' : 'Denied'}
                                </Badge>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

// Permission Check Hook
export function usePermissions(currentUser: User) {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({})

  const checkPermission = async (resource: string, action: string): Promise<boolean> => {
    const key = `${resource}:${action}`
    
    if (permissions[key] !== undefined) {
      return permissions[key]
    }

    try {
      const hasPermission = await checkUserPermission(resource, action)
      setPermissions(prev => ({ ...prev, [key]: hasPermission }))
      return hasPermission
    } catch (error) {
      console.error('Failed to check permission:', error)
      return false
    }
  }

  const checkUserPermission = async (resource: string, action: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/permissions/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          role: currentUser.role, 
          resource, 
          action 
        }),
      })
      if (!response.ok) return false
      const result = await response.json()
      return result.granted
    } catch (error) {
      console.error('Failed to check permission:', error)
      return false
    }
  }

  return { checkPermission }
}

// Permission Guard Component
interface PermissionGuardProps {
  resource: string
  action: string
  currentUser: User
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  resource, 
  action, 
  currentUser, 
  children, 
  fallback 
}: PermissionGuardProps) {
  const { checkPermission } = usePermissions(currentUser)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    checkPermission(resource, action).then(setHasPermission)
  }, [resource, action, currentUser.id])

  if (hasPermission === null) {
    return <div className="animate-pulse">Loading...</div>
  }

  if (!hasPermission) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex items-center gap-2 p-4 border rounded-lg bg-gray-50">
        <Lock className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          You don't have permission to perform this action
        </span>
      </div>
    )
  }

  return <>{children}</>
} 