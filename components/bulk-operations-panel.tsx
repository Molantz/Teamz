'use client'

import { useState, useEffect } from 'react'
import { CheckSquare, Square, Trash2, Edit, Download, Upload, Mail, Settings, AlertTriangle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

interface BulkItem {
  id: string
  name: string
  status: string
  type: string
  selected: boolean
}

interface BulkOperationsPanelProps {
  module: 'users' | 'devices' | 'incidents' | 'requests' | 'projects' | 'inventory'
  items: BulkItem[]
  onSelectionChange: (selectedIds: string[]) => void
  onBulkAction: (action: string, selectedIds: string[], data?: any) => void
}

export function BulkOperationsPanel({ 
  module, 
  items, 
  onSelectionChange, 
  onBulkAction 
}: BulkOperationsPanelProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isActionModalOpen, setIsActionModalOpen] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [actionData, setActionData] = useState<any>({})
  const [isLoading, setIsLoading] = useState(false)

  // Module-specific actions
  const getBulkActions = () => {
    switch (module) {
      case 'users':
        return [
          { id: 'activate', label: 'Activate Users', icon: CheckCircle, description: 'Activate selected users' },
          { id: 'deactivate', label: 'Deactivate Users', icon: AlertTriangle, description: 'Deactivate selected users' },
          { id: 'change_role', label: 'Change Role', icon: Settings, description: 'Change role for selected users' },
          { id: 'send_email', label: 'Send Email', icon: Mail, description: 'Send email to selected users' },
          { id: 'export', label: 'Export Data', icon: Download, description: 'Export user data' },
          { id: 'delete', label: 'Delete Users', icon: Trash2, description: 'Delete selected users', destructive: true }
        ]
      case 'devices':
        return [
          { id: 'assign', label: 'Assign Devices', icon: Settings, description: 'Assign devices to users' },
          { id: 'unassign', label: 'Unassign Devices', icon: Settings, description: 'Unassign devices from users' },
          { id: 'maintenance', label: 'Mark for Maintenance', icon: AlertTriangle, description: 'Mark devices for maintenance' },
          { id: 'retire', label: 'Retire Devices', icon: Trash2, description: 'Retire selected devices' },
          { id: 'export', label: 'Export Data', icon: Download, description: 'Export device data' },
          { id: 'delete', label: 'Delete Devices', icon: Trash2, description: 'Delete selected devices', destructive: true }
        ]
      case 'incidents':
        return [
          { id: 'assign', label: 'Assign Incidents', icon: Settings, description: 'Assign incidents to technicians' },
          { id: 'change_status', label: 'Change Status', icon: Edit, description: 'Change status of incidents' },
          { id: 'change_priority', label: 'Change Priority', icon: AlertTriangle, description: 'Change priority of incidents' },
          { id: 'send_notification', label: 'Send Notification', icon: Mail, description: 'Send notification about incidents' },
          { id: 'export', label: 'Export Data', icon: Download, description: 'Export incident data' },
          { id: 'delete', label: 'Delete Incidents', icon: Trash2, description: 'Delete selected incidents', destructive: true }
        ]
      case 'requests':
        return [
          { id: 'approve', label: 'Approve Requests', icon: CheckCircle, description: 'Approve selected requests' },
          { id: 'reject', label: 'Reject Requests', icon: AlertTriangle, description: 'Reject selected requests' },
          { id: 'change_status', label: 'Change Status', icon: Edit, description: 'Change status of requests' },
          { id: 'send_notification', label: 'Send Notification', icon: Mail, description: 'Send notification about requests' },
          { id: 'export', label: 'Export Data', icon: Download, description: 'Export request data' },
          { id: 'delete', label: 'Delete Requests', icon: Trash2, description: 'Delete selected requests', destructive: true }
        ]
      default:
        return [
          { id: 'export', label: 'Export Data', icon: Download, description: 'Export data' },
          { id: 'delete', label: 'Delete Items', icon: Trash2, description: 'Delete selected items', destructive: true }
        ]
    }
  }

  const bulkActions = getBulkActions()

  const handleSelectAll = (checked: boolean) => {
    const allIds = items.map(item => item.id)
    const newSelection = checked ? allIds : []
    setSelectedItems(newSelection)
    onSelectionChange(newSelection)
  }

  const handleSelectItem = (itemId: string, checked: boolean) => {
    const newSelection = checked 
      ? [...selectedItems, itemId]
      : selectedItems.filter(id => id !== itemId)
    setSelectedItems(newSelection)
    onSelectionChange(newSelection)
  }

  const handleBulkAction = (action: string) => {
    setSelectedAction(action)
    setActionData({})
    setIsActionModalOpen(true)
  }

  const executeBulkAction = async () => {
    if (selectedItems.length === 0) {
      toast.error('No items selected')
      return
    }

    setIsLoading(true)
    try {
      await onBulkAction(selectedAction, selectedItems, actionData)
      toast.success(`Bulk action '${selectedAction}' completed successfully`)
      setIsActionModalOpen(false)
      setSelectedItems([])
      onSelectionChange([])
    } catch (error) {
      console.error('Bulk action failed:', error)
      toast.error('Bulk action failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getActionForm = () => {
    switch (selectedAction) {
      case 'change_role':
        return (
          <div className="space-y-4">
            <div>
              <Label>New Role</Label>
              <Select value={actionData.role} onValueChange={(value) => setActionData({ ...actionData, role: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'send_email':
        return (
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input 
                value={actionData.subject || ''} 
                onChange={(e) => setActionData({ ...actionData, subject: e.target.value })}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                value={actionData.message || ''} 
                onChange={(e) => setActionData({ ...actionData, message: e.target.value })}
                placeholder="Email message"
                rows={4}
              />
            </div>
          </div>
        )

      case 'assign':
        return (
          <div className="space-y-4">
            <div>
              <Label>Assign To</Label>
              <Select value={actionData.assignedTo} onValueChange={(value) => setActionData({ ...actionData, assignedTo: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user1">John Doe</SelectItem>
                  <SelectItem value="user2">Jane Smith</SelectItem>
                  <SelectItem value="user3">Mike Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea 
                value={actionData.notes || ''} 
                onChange={(e) => setActionData({ ...actionData, notes: e.target.value })}
                placeholder="Assignment notes"
                rows={3}
              />
            </div>
          </div>
        )

      case 'change_status':
        return (
          <div className="space-y-4">
            <div>
              <Label>New Status</Label>
              <Select value={actionData.status} onValueChange={(value) => setActionData({ ...actionData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason</Label>
              <Textarea 
                value={actionData.reason || ''} 
                onChange={(e) => setActionData({ ...actionData, reason: e.target.value })}
                placeholder="Status change reason"
                rows={3}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <p className="text-gray-600">No additional configuration needed for this action.</p>
          </div>
        )
    }
  }

  const getActionDescription = () => {
    const action = bulkActions.find(a => a.id === selectedAction)
    return action?.description || ''
  }

  const isDestructiveAction = () => {
    const action = bulkActions.find(a => a.id === selectedAction)
    return action?.destructive || false
  }

  return (
    <>
      {/* Bulk Operations Bar */}
      {selectedItems.length > 0 && (
        <Card className="mb-4 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedItems([])
                    onSelectionChange([])
                  }}
                >
                  Clear Selection
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select value="" onValueChange={handleBulkAction}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Bulk Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    {bulkActions.map((action) => (
                      <SelectItem key={action.id} value={action.id}>
                        <div className="flex items-center gap-2">
                          <action.icon className="h-4 w-4" />
                          {action.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Items List with Checkboxes */}
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={selectedItems.includes(item.id)}
                  onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Select All Option */}
      {items.length > 0 && (
        <div className="flex items-center gap-2 mt-4 p-2 bg-gray-50 rounded-lg">
          <Checkbox
            checked={selectedItems.length === items.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            Select All ({items.length} items)
          </span>
        </div>
      )}

      {/* Bulk Action Modal */}
      <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {(() => {
                const action = bulkActions.find(a => a.id === selectedAction);
                const IconComponent = action?.icon;
                return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
              })()}
              Bulk Action: {bulkActions.find(a => a.id === selectedAction)?.label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                This action will affect {selectedItems.length} selected item{selectedItems.length !== 1 ? 's' : ''}.
              </p>
            </div>

            {getActionForm()}

            {isDestructiveAction() && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-800">Destructive Action</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  This action cannot be undone. Please confirm you want to proceed.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeBulkAction}
              disabled={isLoading}
              variant={isDestructiveAction() ? 'destructive' : 'default'}
            >
              {isLoading ? 'Processing...' : 'Execute Action'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 