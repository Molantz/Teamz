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
import { ShieldAlert, AlertTriangle, Clock, User, Building, Laptop } from "lucide-react"

interface ReportIssueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}

const issueCategories = [
  "Hardware Issue",
  "Software Problem",
  "Network Connectivity",
  "Access/Permissions",
  "Email/Communication",
  "Printer/Scanner",
  "Security Incident",
  "Performance Issue",
  "Other"
]

const priorityLevels = [
  { value: "Low", label: "Low", description: "Minor issue, non-critical" },
  { value: "Medium", label: "Medium", description: "Moderate impact on work" },
  { value: "High", label: "High", description: "Significant impact on operations" },
  { value: "Critical", label: "Critical", description: "System down or security breach" }
]

const departments = [
  "IT Support",
  "Network Team",
  "Software Development",
  "Hardware Support",
  "Security Team",
  "General"
]

export function ReportIssueModal({ open, onOpenChange, onSubmit }: ReportIssueModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    priority: "Medium",
    description: "",
    affectedUser: "",
    affectedDevice: "",
    department: "",
    contactEmail: "",
    contactPhone: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { incidentsApi } = await import('@/lib/api')
      
      const newIssue = {
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        description: formData.description,
        affected_user: formData.affectedUser,
        affected_device: formData.affectedDevice,
        department: formData.department,
        contact_email: formData.contactEmail,
        contact_phone: formData.contactPhone,
        steps_to_reproduce: formData.stepsToReproduce,
        expected_behavior: formData.expectedBehavior,
        actual_behavior: formData.actualBehavior,
        status: "New",
        assignee: "Unassigned"
      }
      
      const createdIssue = await incidentsApi.create(newIssue)
      
      if (onSubmit) {
        onSubmit(createdIssue)
      }
      
      toast.success(`Issue "${formData.title}" reported successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Reported issue',
        'incident',
        createdIssue.id,
        `Reported issue: ${formData.title} (${formData.priority} priority)`
      )
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        priority: "Medium",
        description: "",
        affectedUser: "",
        affectedDevice: "",
        department: "",
        contactEmail: "",
        contactPhone: "",
        stepsToReproduce: "",
        expectedBehavior: "",
        actualBehavior: ""
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to report issue:', error)
      toast.error("Failed to report issue")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "text-red-600"
      case "High":
        return "text-orange-600"
      case "Medium":
        return "text-yellow-600"
      case "Low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Report Issue
          </DialogTitle>
          <DialogDescription>
            Report a new IT issue or incident for immediate attention
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the issue"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {issueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center gap-2">
                        <Badge variant={priority.value === "Critical" ? "destructive" : priority.value === "High" ? "default" : "secondary"}>
                          {priority.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{priority.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Provide a detailed description of the issue..."
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="affectedUser">Affected User</Label>
              <Input
                id="affectedUser"
                value={formData.affectedUser}
                onChange={(e) => handleInputChange("affectedUser", e.target.value)}
                placeholder="User name or email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affectedDevice">Affected Device</Label>
              <Input
                id="affectedDevice"
                value={formData.affectedDevice}
                onChange={(e) => handleInputChange("affectedDevice", e.target.value)}
                placeholder="Device name or asset ID"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange("contactEmail", e.target.value)}
                placeholder="your.email@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone</Label>
            <Input
              id="contactPhone"
              type="tel"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange("contactPhone", e.target.value)}
              placeholder="+2348012345678"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Additional Information</CardTitle>
              <CardDescription>Help us understand and resolve the issue faster</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
                <Textarea
                  id="stepsToReproduce"
                  value={formData.stepsToReproduce}
                  onChange={(e) => handleInputChange("stepsToReproduce", e.target.value)}
                  placeholder="1. Open the application...&#10;2. Click on...&#10;3. Error occurs when..."
                  rows={3}
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expectedBehavior">Expected Behavior</Label>
                  <Textarea
                    id="expectedBehavior"
                    value={formData.expectedBehavior}
                    onChange={(e) => handleInputChange("expectedBehavior", e.target.value)}
                    placeholder="What should happen normally?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actualBehavior">Actual Behavior</Label>
                  <Textarea
                    id="actualBehavior"
                    value={formData.actualBehavior}
                    onChange={(e) => handleInputChange("actualBehavior", e.target.value)}
                    placeholder="What is happening instead?"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.title || !formData.category || !formData.description}>
            {isLoading ? "Reporting..." : "Report Issue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 