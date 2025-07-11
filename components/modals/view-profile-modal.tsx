"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Laptop,
  FolderKanban,
  FileText,
  CreditCard,
  Download,
  Edit,
  History,
} from "lucide-react"

interface ViewProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
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
  }
}

export function ViewProfileModal({ open, onOpenChange, user }: ViewProfileModalProps) {
  const assignedDevices = [
    { id: "DEV-001", name: "Dell Latitude 7420", type: "Laptop", status: "Active", assignedDate: "2024-01-15" },
    { id: "DEV-002", name: "iPhone 14 Pro", type: "Mobile", status: "Active", assignedDate: "2024-01-20" },
    { id: "DEV-003", name: "Dell Monitor 27", type: "Monitor", status: "Active", assignedDate: "2024-01-15" },
  ]

  const assignedProjects = [
    { id: "PRJ-001", name: "Network Infrastructure Upgrade", role: "Lead", status: "Ongoing", progress: 65 },
    { id: "PRJ-002", name: "Security System Implementation", role: "Member", status: "Planned", progress: 15 },
  ]

  const documents = [
    { name: "Employment Contract", type: "Contract", uploadDate: "2024-01-15", size: "2.3 MB" },
    { name: "ID Document", type: "Identification", uploadDate: "2024-01-15", size: "1.2 MB" },
    { name: "Passport Photo", type: "Photo", uploadDate: "2024-01-15", size: "0.8 MB" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Employee Profile
          </DialogTitle>
          <DialogDescription>Complete profile information and assignments for {user.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback className="text-lg">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.position}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{user.department}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{user.status}</Badge>
                    <Badge variant="outline">{user.employeeId}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="devices" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="idcard">ID Card</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Laptop className="h-5 w-5" />
                    Assigned Devices ({assignedDevices.length})
                  </CardTitle>
                  <CardDescription>IT equipment and devices assigned to this employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assigned Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assignedDevices.map((device) => (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{device.name}</div>
                              <div className="text-sm text-muted-foreground">{device.id}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{device.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="default">{device.status}</Badge>
                          </TableCell>
                          <TableCell>{device.assignedDate}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Unassign
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-4">
                    <Button variant="outline">
                      <Laptop className="h-4 w-4 mr-2" />
                      Assign New Device
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderKanban className="h-5 w-5" />
                    Assigned Projects ({assignedProjects.length})
                  </CardTitle>
                  <CardDescription>Active and upcoming project assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignedProjects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {project.id} • Role: {project.role}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge variant={project.status === "Ongoing" ? "default" : "secondary"}>
                              {project.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">{project.progress}% Complete</div>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Documents ({documents.length})
                  </CardTitle>
                  <CardDescription>Employee documents and files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">{doc.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {doc.type} • {doc.size} • {doc.uploadDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="idcard" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    ID Card Management
                  </CardTitle>
                  <CardDescription>Generate and manage employee ID card</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="aspect-[1.6/1] bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-white relative overflow-hidden">
                        <div className="absolute top-2 right-2">
                          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                            <Building2 className="h-4 w-4" />
                          </div>
                        </div>
                        <Avatar className="w-16 h-16 mb-2 border-2 border-white/20">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-bold text-sm">{user.name}</div>
                          <div className="text-xs opacity-90">{user.position}</div>
                          <div className="text-xs opacity-75">{user.department}</div>
                          <div className="text-xs opacity-75">ID: {user.employeeId}</div>
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                            <CreditCard className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 left-2 text-xs opacity-75">Exp: 12/2025</div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="font-medium">Card Status</div>
                        <div className="text-muted-foreground">Active • Expires Dec 2025</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Last Generated</div>
                        <div className="text-muted-foreground">January 15, 2024</div>
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">Print Count</div>
                        <div className="text-muted-foreground">2 times</div>
                      </div>
                      <div className="space-y-2 pt-4">
                        <Button className="w-full" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Card
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          Generate New Card
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" size="sm">
                          Print Card
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Audit log and recent changes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Device assigned", details: "Dell Latitude 7420", time: "2 hours ago" },
                      { action: "Profile updated", details: "Phone number changed", time: "1 day ago" },
                      { action: "Project assigned", details: "Network Infrastructure Upgrade", time: "3 days ago" },
                      { action: "ID card generated", details: "New employee card", time: "1 week ago" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                          <History className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{activity.action}</div>
                          <div className="text-sm text-muted-foreground">{activity.details}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.time}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
