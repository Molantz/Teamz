"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { auditLogger } from "@/lib/audit-log"
import { Laptop, User, Calendar, Building, Package, CheckCircle } from "lucide-react"

interface AssignDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}

const availableDevices = [
  { id: "LAP-001", name: "Dell Latitude 5520", type: "Laptop", status: "Available", location: "Head Office" },
  { id: "LAP-002", name: "HP EliteBook 840", type: "Laptop", status: "Available", location: "Head Office" },
  { id: "DESK-001", name: "Dell OptiPlex 7090", type: "Desktop", status: "Available", location: "Branch Office A" },
  { id: "MON-001", name: "Dell P2419H Monitor", type: "Monitor", status: "Available", location: "Head Office" },
  { id: "MON-002", name: "HP E24 Monitor", type: "Monitor", status: "Available", location: "Branch Office B" },
  { id: "PRINT-001", name: "HP LaserJet Pro", type: "Printer", status: "Available", location: "Head Office" }
]

const users = [
  { id: "USR-001", name: "John Smith", email: "john.smith@company.com", department: "IT Support" },
  { id: "USR-002", name: "Sarah Johnson", email: "sarah.johnson@company.com", department: "Network Team" },
  { id: "USR-003", name: "Mike Wilson", email: "mike.wilson@company.com", department: "Hardware Support" },
  { id: "USR-004", name: "Lisa Brown", email: "lisa.brown@company.com", department: "Software Support" },
  { id: "USR-005", name: "David Lee", email: "david.lee@company.com", department: "Sales" },
  { id: "USR-006", name: "Emma Davis", email: "emma.davis@company.com", department: "Marketing" }
]

const assignmentTypes = [
  "Permanent Assignment",
  "Temporary Assignment",
  "Loan",
  "Replacement",
  "New Hire"
]

export function AssignDeviceModal({ open, onOpenChange, onSubmit }: AssignDeviceModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    deviceId: "",
    userId: "",
    assignmentType: "",
    assignmentDate: "",
    expectedReturnDate: "",
    reason: "",
    notes: "",
    terms: "",
    supervisor: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { assignmentsApi } = await import('@/lib/api')
      
      const selectedDevice = availableDevices.find(d => d.id === formData.deviceId)
      const selectedUser = users.find(u => u.id === formData.userId)
      
      const newAssignment = {
        device_id: formData.deviceId,
        user_id: formData.userId,
        assignment_type: formData.assignmentType,
        assignment_date: formData.assignmentDate,
        expected_return_date: formData.expectedReturnDate,
        reason: formData.reason,
        notes: formData.notes,
        terms: formData.terms,
        supervisor: formData.supervisor,
        status: "Active"
      }
      
      const createdAssignment = await assignmentsApi.create(newAssignment)
      
      if (onSubmit) {
        onSubmit(createdAssignment)
      }
      
      toast.success(`Device assigned to ${selectedUser?.name} successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Assigned device',
        'assignment',
        createdAssignment.id,
        `Assigned ${selectedDevice?.name} to ${selectedUser?.name}`
      )
      
      // Reset form
      setFormData({
        deviceId: "",
        userId: "",
        assignmentType: "",
        assignmentDate: "",
        expectedReturnDate: "",
        reason: "",
        notes: "",
        terms: "",
        supervisor: ""
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to assign device:', error)
      toast.error("Failed to assign device")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "Laptop":
        return <Laptop className="h-4 w-4" />
      case "Desktop":
        return <Package className="h-4 w-4" />
      case "Monitor":
        return <Package className="h-4 w-4" />
      case "Printer":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Assign Device
          </DialogTitle>
          <DialogDescription>
            Assign IT equipment to users or departments
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="deviceId">Select Device *</Label>
            <Select value={formData.deviceId} onValueChange={(value) => handleInputChange("deviceId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a device to assign" />
              </SelectTrigger>
              <SelectContent>
                {availableDevices.map((device) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(device.type)}
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {device.type} • {device.location}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userId">Assign To *</Label>
            <Select value={formData.userId} onValueChange={(value) => handleInputChange("userId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user to assign device to" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email} • {user.department}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="assignmentType">Assignment Type *</Label>
              <Select value={formData.assignmentType} onValueChange={(value) => handleInputChange("assignmentType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignment type" />
                </SelectTrigger>
                <SelectContent>
                  {assignmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignmentDate">Assignment Date *</Label>
              <Input
                id="assignmentDate"
                type="date"
                value={formData.assignmentDate}
                onChange={(e) => handleInputChange("assignmentDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturnDate">Expected Return Date</Label>
            <Input
              id="expectedReturnDate"
              type="date"
              value={formData.expectedReturnDate}
              onChange={(e) => handleInputChange("expectedReturnDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Assignment *</Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Why is this device being assigned?"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supervisor">Supervisor Approval</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => handleInputChange("supervisor", e.target.value)}
              placeholder="Supervisor name or email"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Assignment Terms</CardTitle>
              <CardDescription>Set conditions and responsibilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => handleInputChange("terms", e.target.value)}
                  placeholder="Device usage policies, care instructions, return conditions..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Any additional information about this assignment..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.deviceId || !formData.userId || !formData.assignmentType || !formData.assignmentDate || !formData.reason}>
            {isLoading ? "Assigning..." : "Assign Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
