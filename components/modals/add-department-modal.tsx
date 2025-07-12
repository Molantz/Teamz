"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Users, DollarSign, MapPin, User, Calendar, AlertCircle } from "lucide-react"
import { Department } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { auditLogger } from "@/lib/audit-log"

interface AddDepartmentModalProps {
  isOpen: boolean
  onClose: () => void
  department?: Department
  mode: 'add' | 'edit'
  onSuccess: () => void
}

interface FormData {
  name: string
  code: string
  manager_id: string
  budget: number
  location: string
  description: string
}

const mockEmployees = [
  { id: "emp-001", name: "John Smith", avatar: "/placeholder-user.jpg", position: "IT Manager" },
  { id: "emp-002", name: "Sarah Johnson", avatar: "/placeholder-user.jpg", position: "HR Director" },
  { id: "emp-003", name: "Mike Wilson", avatar: "/placeholder-user.jpg", position: "Engineering Manager" },
  { id: "emp-004", name: "Emily Davis", avatar: "/placeholder-user.jpg", position: "Marketing Director" },
  { id: "emp-005", name: "David Brown", avatar: "/placeholder-user.jpg", position: "Finance Manager" },
  { id: "emp-006", name: "Lisa Chen", avatar: "/placeholder-user.jpg", position: "Operations Manager" },
]

export function AddDepartmentModal({ isOpen, onClose, department, mode, onSuccess }: AddDepartmentModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    code: "",
    manager_id: "",
    budget: 0,
    location: "",
    description: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (department && mode === 'edit') {
      setFormData({
        name: department.name,
        code: department.code,
        manager_id: department.manager_id || "",
        budget: department.budget || 0,
        location: department.location || "",
        description: department.description || ""
      })
    } else {
      setFormData({
        name: "",
        code: "",
        manager_id: "",
        budget: 0,
        location: "",
        description: ""
      })
    }
    setErrors({})
  }, [department, mode, isOpen])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Department name is required"
    }

    if (!formData.code.trim()) {
      newErrors.code = "Department code is required"
    } else if (formData.code.length > 10) {
      newErrors.code = "Department code must be 10 characters or less"
    }

    if (formData.budget < 0) {
      newErrors.budget = "Budget must be a positive number"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const departmentData = {
        ...formData,
        budget: Number(formData.budget)
      }

      if (mode === 'add') {
        // In real app: await departmentsApi.create(departmentData)
        console.log('Creating department:', departmentData)
        
        auditLogger.log({
          userId: 'admin-001',
          userName: 'John Doe',
          action: 'Created Department',
          entityType: 'department',
          details: `Created new department: ${departmentData.name} (${departmentData.code})`,
          severity: 'info',
          category: 'create'
        })

        toast({
          title: "Success",
          description: "Department created successfully"
        })
      } else {
        // In real app: await departmentsApi.update(department!.id, departmentData)
        console.log('Updating department:', department!.id, departmentData)
        
        auditLogger.log({
          userId: 'admin-001',
          userName: 'John Doe',
          action: 'Updated Department',
          entityType: 'department',
          entityId: department!.id,
          details: `Updated department: ${departmentData.name} (${departmentData.code})`,
          severity: 'info',
          category: 'update'
        })

        toast({
          title: "Success",
          description: "Department updated successfully"
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error saving department:', error)
      toast({
        title: "Error",
        description: `Failed to ${mode} department`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const selectedManager = mockEmployees.find(emp => emp.id === formData.manager_id)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {mode === 'add' ? 'Add New Department' : 'Edit Department'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' 
              ? 'Create a new department with budget, location, and manager assignment.'
              : 'Update department information and settings.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Information Technology"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Department Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="e.g., IT"
                maxLength={10}
                className={errors.code ? 'border-red-500' : ''}
              />
              {errors.code && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.code}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Department Manager</Label>
            <Select value={formData.manager_id} onValueChange={(value) => handleInputChange('manager_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback className="text-xs">
                          {employee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.position}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedManager && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Selected Manager</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedManager.avatar} />
                    <AvatarFallback>
                      {selectedManager.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedManager.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedManager.position}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Annual Budget</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', Number(e.target.value))}
                  placeholder="0"
                  className="pl-10"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.budget}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Building A, Floor 3"
                  className="pl-10"
                />
              </div>
              {errors.location && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.location}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the department's purpose and responsibilities..."
              rows={3}
            />
          </div>

          {mode === 'edit' && department && (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-800">Department Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span>Created: {new Date(department.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>ID: {department.id}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {mode === 'add' ? 'Creating...' : 'Updating...'}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {mode === 'add' ? 'Create Department' : 'Update Department'}
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 