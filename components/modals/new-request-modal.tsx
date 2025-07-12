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
import { Wrench, Calendar, User, Building, DollarSign, Clock } from "lucide-react"

interface NewRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}

const requestTypes = [
  "Hardware Request",
  "Software Request",
  "Access Request",
  "Service Change",
  "Maintenance Request",
  "Training Request",
  "Consultation",
  "Other"
]

const priorityLevels = [
  { value: "Low", label: "Low", description: "Can wait, non-urgent" },
  { value: "Medium", label: "Medium", description: "Standard priority" },
  { value: "High", label: "High", description: "Important for work" },
  { value: "Urgent", label: "Urgent", description: "Critical for operations" }
]

const departments = [
  "IT Support",
  "Network Team",
  "Software Development",
  "Hardware Support",
  "Security Team",
  "Sales",
  "Marketing",
  "HR",
  "Finance",
  "Operations"
]

export function NewRequestModal({ open, onOpenChange, onSubmit }: NewRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    type: "",
    priority: "Medium",
    description: "",
    requester: "",
    department: "",
    budget: "",
    expectedDelivery: "",
    justification: "",
    impact: "",
    alternatives: "",
    attachments: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newRequest = {
        id: `REQ-${Date.now()}`,
        ...formData,
        status: "Pending",
        createdAt: new Date().toISOString(),
        approvedBy: null,
        approvedAt: null,
        lastUpdated: new Date().toISOString()
      }
      
      if (onSubmit) {
        onSubmit(newRequest)
      }
      
      toast.success(`Request "${formData.title}" submitted successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created service request',
        'request',
        newRequest.id,
        `Created request: ${formData.title} (${formData.type})`
      )
      
      // Reset form
      setFormData({
        title: "",
        type: "",
        priority: "Medium",
        description: "",
        requester: "",
        department: "",
        budget: "",
        expectedDelivery: "",
        justification: "",
        impact: "",
        alternatives: "",
        attachments: ""
      })
      
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to submit request")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            New Service Request
          </DialogTitle>
          <DialogDescription>
            Submit a new service request for IT resources or assistance
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Request Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Brief description of the request"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Request Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
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
                        <Badge variant={priority.value === "Urgent" ? "destructive" : priority.value === "High" ? "default" : "secondary"}>
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
              placeholder="Provide a detailed description of what you need..."
              rows={4}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="requester">Requester</Label>
              <Input
                id="requester"
                value={formData.requester}
                onChange={(e) => handleInputChange("requester", e.target.value)}
                placeholder="Your name or email"
              />
            </div>
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
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">Estimated Budget</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expectedDelivery">Expected Delivery</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={formData.expectedDelivery}
                onChange={(e) => handleInputChange("expectedDelivery", e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Business Justification</CardTitle>
              <CardDescription>Help us understand the business need</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="justification">Justification *</Label>
                <Textarea
                  id="justification"
                  value={formData.justification}
                  onChange={(e) => handleInputChange("justification", e.target.value)}
                  placeholder="Why is this request needed? What business problem does it solve?"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="impact">Business Impact</Label>
                  <Textarea
                    id="impact"
                    value={formData.impact}
                    onChange={(e) => handleInputChange("impact", e.target.value)}
                    placeholder="What will happen if this request is approved/denied?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternatives">Alternatives Considered</Label>
                  <Textarea
                    id="alternatives"
                    value={formData.alternatives}
                    onChange={(e) => handleInputChange("alternatives", e.target.value)}
                    placeholder="What other options have you considered?"
                    rows={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="attachments">Additional Attachments</Label>
            <Input
              id="attachments"
              value={formData.attachments}
              onChange={(e) => handleInputChange("attachments", e.target.value)}
              placeholder="Links to relevant documents or specifications"
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.title || !formData.type || !formData.description || !formData.justification}>
            {isLoading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 