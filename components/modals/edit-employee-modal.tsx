"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { User, Upload, Camera, Save, FileText, CreditCard, Key, Building2 } from "lucide-react"
import { SignaturePad } from "@/components/ui/signature-pad"
import { useState } from "react"

interface EditEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee: {
    id: string
    name: string
    email: string
    phone: string
    department: string
    position: string
    employeeId: string
    joinDate: string
    status: string
    avatar: string
    signature?: string
  }
}

export function EditEmployeeModal({ open, onOpenChange, employee }: EditEmployeeModalProps) {
  const [formData, setFormData] = useState(employee)
  const [triggerIdReissue, setTriggerIdReissue] = useState(false)

  const handleSave = () => {
    // Handle save logic
    console.log("Saving employee data:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Employee Profile
          </DialogTitle>
          <DialogDescription>Update employee information and settings</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="access">Access</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Photo Upload */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={formData.name} />
                    <AvatarFallback className="text-lg">
                      {formData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: 400x400px, max 2MB</p>
                  </div>
                </div>

                <Separator />

                {/* Personal Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input
                      id="first-name"
                      value={formData.name.split(" ")[0]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: `${e.target.value} ${formData.name.split(" ")[1] || ""}`,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input
                      id="last-name"
                      value={formData.name.split(" ")[1] || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: `${formData.name.split(" ")[0]} ${e.target.value}`,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-id">Employee ID</Label>
                    <Input
                      id="employee-id"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                {/* Job Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="position">Job Title</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Information Technology">Information Technology</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor">Supervisor</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supervisor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe - IT Director</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith - HR Manager</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson - Engineering Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Signature */}
                <div className="space-y-2">
                  <Label>Digital Signature</Label>
                  <SignaturePad
                    onSave={(signatureData) => {
                      // Store signature data in form state
                      setFormData(prev => ({ ...prev, signature: signatureData }))
                    }}
                    onClear={() => {
                      setFormData(prev => ({ ...prev, signature: undefined }))
                    }}
                    initialSignature={formData.signature}
                    width={350}
                    height={150}
                    className="border-0 shadow-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* ID Card Reissue */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  ID Card Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="trigger-id-reissue" checked={triggerIdReissue} onCheckedChange={setTriggerIdReissue} />
                  <Label htmlFor="trigger-id-reissue">Trigger ID card reissue after saving</Label>
                </div>
                {triggerIdReissue && (
                  <div className="ml-6 p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      A new ID card will be generated automatically with the updated information. The employee will be
                      notified via email when the card is ready.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Management
                </CardTitle>
                <CardDescription>Upload and manage employee documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ID Documents</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contracts & Forms</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                      <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
                      <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Photos</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <Camera className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Take photo or upload image</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Camera
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="access" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Access Control
                </CardTitle>
                <CardDescription>Manage user roles and system permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="user-role">User Role</Label>
                  <Select defaultValue="employee">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>System Permissions</Label>
                  <div className="space-y-3">
                    {[
                      { name: "View Dashboard", enabled: true },
                      { name: "Manage Devices", enabled: false },
                      { name: "Create Incidents", enabled: true },
                      { name: "View Reports", enabled: true },
                      { name: "Manage Users", enabled: false },
                      { name: "System Settings", enabled: false },
                    ].map((permission, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Switch id={`permission-${index}`} defaultChecked={permission.enabled} />
                        <Label htmlFor={`permission-${index}`}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Password Reset</Label>
                  <div className="flex gap-2">
                    <Button variant="outline">Send Reset Email</Button>
                    <Button variant="outline">Generate Temporary Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Project & Device Assignments
                </CardTitle>
                <CardDescription>Manage project assignments and device allocations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Assign to Projects</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select projects to assign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="proj1">Network Infrastructure Upgrade</SelectItem>
                      <SelectItem value="proj2">Security System Implementation</SelectItem>
                      <SelectItem value="proj3">Cloud Migration Phase 2</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Device Reassignment</Label>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Building2 className="h-4 w-4 mr-2" />
                      Reassign Current Devices
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Building2 className="h-4 w-4 mr-2" />
                      Assign New Devices
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignment-notes">Assignment Notes</Label>
                  <Textarea
                    id="assignment-notes"
                    placeholder="Add notes about project assignments or special requirements..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
