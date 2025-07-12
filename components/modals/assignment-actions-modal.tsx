'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Package, 
  User as UserIcon, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'
import { 
  assignPRItemToInventory, 
  assignPRItemToUser, 
  assignPRItemToDepartment,
  getAssignmentActions
} from '@/lib/api'
import type { PRItem, AssignmentAction, InventoryItem, User, Department } from '@/lib/types'

interface AssignmentActionsModalProps {
  isOpen: boolean
  onClose: () => void
  prItem: PRItem
  currentUser: User
  inventoryItems?: InventoryItem[]
  users?: User[]
  departments?: Department[]
}

export function AssignmentActionsModal({
  isOpen,
  onClose,
  prItem,
  currentUser,
  inventoryItems = [],
  users = [],
  departments = []
}: AssignmentActionsModalProps) {
  const [activeTab, setActiveTab] = useState<'inventory' | 'user' | 'department'>('inventory')
  const [selectedTarget, setSelectedTarget] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [assignmentActions, setAssignmentActions] = useState<AssignmentAction[]>([])

  useEffect(() => {
    if (isOpen && prItem.id) {
      loadAssignmentActions()
    }
  }, [isOpen, prItem.id])

  const loadAssignmentActions = async () => {
    try {
      const actions = await getAssignmentActions(prItem.id)
      setAssignmentActions(actions)
    } catch (error) {
      console.error('Failed to load assignment actions:', error)
    }
  }

  const handleAssign = async () => {
    if (!selectedTarget) {
      toast.error('Please select a target for assignment')
      return
    }

    setIsLoading(true)
    try {
      let action: AssignmentAction

      switch (activeTab) {
        case 'inventory':
          action = await assignPRItemToInventory(prItem.id, selectedTarget, currentUser.id, notes)
          break
        case 'user':
          action = await assignPRItemToUser(prItem.id, selectedTarget, currentUser.id, notes)
          break
        case 'department':
          action = await assignPRItemToDepartment(prItem.id, selectedTarget, currentUser.id, notes)
          break
        default:
          throw new Error('Invalid assignment type')
      }

      toast.success('Item assigned successfully')
      await loadAssignmentActions()
      setSelectedTarget('')
      setNotes('')
    } catch (error) {
      console.error('Assignment failed:', error)
      toast.error('Failed to assign item')
    } finally {
      setIsLoading(false)
    }
  }

  const getTargetName = (action: AssignmentAction) => {
    switch (action.action_type) {
      case 'assign_to_inventory':
        const inventoryItem = inventoryItems.find(item => item.id === action.target_id)
        return inventoryItem?.name || 'Unknown Inventory Item'
      case 'assign_to_user':
        const user = users.find(u => u.id === action.target_id)
        return user?.name || 'Unknown User'
      case 'assign_to_department':
        const department = departments.find(d => d.id === action.target_id)
        return department?.name || 'Unknown Department'
      default:
        return 'Unknown Target'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Assignment Actions - {prItem.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignment Form */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assign Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="inventory" className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Inventory
                    </TabsTrigger>
                    <TabsTrigger value="user" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      User
                    </TabsTrigger>
                    <TabsTrigger value="department" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Department
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="inventory" className="space-y-4">
                    <div>
                      <Label htmlFor="inventory-select">Select Inventory Item</Label>
                      <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose inventory item" />
                        </SelectTrigger>
                        <SelectContent>
                          {inventoryItems.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} ({item.status})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="user" className="space-y-4">
                    <div>
                      <Label htmlFor="user-select">Select User</Label>
                      <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose user" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name} ({user.role})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="department" className="space-y-4">
                    <div>
                      <Label htmlFor="department-select">Select Department</Label>
                      <Select value={selectedTarget} onValueChange={setSelectedTarget}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this assignment..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={handleAssign} 
                  disabled={!selectedTarget || isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Assigning...' : 'Assign Item'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Assignment History */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assignment History</CardTitle>
              </CardHeader>
              <CardContent>
                {assignmentActions.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No assignment actions yet
                  </div>
                ) : (
                  <div className="space-y-3">
                    {assignmentActions.map((action) => (
                      <div key={action.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(action.status)}
                            <span className="font-medium">
                              {action.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          </div>
                          <Badge className={getStatusColor(action.status)}>
                            {action.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p><strong>Target:</strong> {getTargetName(action)}</p>
                          <p><strong>Assigned by:</strong> {action.assigned_by}</p>
                          <p><strong>Date:</strong> {new Date(action.assigned_at).toLocaleString()}</p>
                          {action.notes && (
                            <p><strong>Notes:</strong> {action.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 