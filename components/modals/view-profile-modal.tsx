"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
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
  Plus,
  Upload,
  Printer,
  Eye,
  Trash2,
  Settings,
  Activity
} from "lucide-react"
import { assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { Asset, Incident, Request } from "@/lib/supabase"

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

interface AssignedDevice {
  id: string
  name: string
  type: string
  status: string
  assignedDate: string
  serialNumber?: string
}

interface AssignedProject {
  id: string
  name: string
  role: string
  status: string
  progress: number
  startDate: string
  endDate?: string
}

interface Document {
  id: string
  name: string
  type: string
  uploadDate: string
  size: string
  url?: string
}

interface ActivityLog {
  id: string
  action: string
  description: string
  timestamp: string
  user: string
}

export function ViewProfileModal({ open, onOpenChange, user }: ViewProfileModalProps) {
  const [assignedDevices, setAssignedDevices] = useState<AssignedDevice[]>([])
  const [assignedProjects, setAssignedProjects] = useState<AssignedProject[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch real-time data when modal opens
  useEffect(() => {
    if (open && user.id) {
      fetchUserData()
    }
  }, [open, user.id])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      const [assetsData, incidentsData, requestsData] = await Promise.all([
        assetsApi.getAll(),
        incidentsApi.getAll(),
        requestsApi.getAll()
      ])

      // Get assigned devices
      const userDevices = assetsData
        .filter(asset => asset.assigned_to === user.id)
        .map(asset => ({
          id: asset.id,
          name: asset.name,
          type: asset.type,
          status: asset.status,
          assignedDate: new Date(asset.created_at).toLocaleDateString(),
          serialNumber: asset.serial_number
        }))
      setAssignedDevices(userDevices)

      // Mock projects data (would come from projects API)
      const mockProjects: AssignedProject[] = [
        {
          id: "PRJ-001",
          name: "Network Infrastructure Upgrade",
          role: "Lead",
          status: "Ongoing",
          progress: 65,
          startDate: "2024-01-15"
        },
        {
          id: "PRJ-002",
          name: "Security System Implementation",
          role: "Member",
          status: "Planned",
          progress: 15,
          startDate: "2024-02-01"
        }
      ]
      setAssignedProjects(mockProjects)

      // Mock documents data (would come from documents API)
      const mockDocuments: Document[] = [
        {
          id: "DOC-001",
          name: "Employment Contract",
          type: "Contract",
          uploadDate: "2024-01-15",
          size: "2.3 MB"
        },
        {
          id: "DOC-002",
          name: "ID Document",
          type: "Identification",
          uploadDate: "2024-01-15",
          size: "1.2 MB"
        },
        {
          id: "DOC-003",
          name: "Passport Photo",
          type: "Photo",
          uploadDate: "2024-01-15",
          size: "0.8 MB"
        }
      ]
      setDocuments(mockDocuments)

      // Generate activity log from real data
      const activities: ActivityLog[] = []

      // Device assignments
      userDevices.forEach(device => {
        activities.push({
          id: `device-${device.id}`,
          action: "Device assigned",
          description: device.name,
          timestamp: device.assignedDate,
          user: "System"
        })
      })

      // Recent incidents
      const userIncidents = incidentsData
        .filter(incident => incident.assignee === user.id)
        .slice(0, 3)
        .forEach(incident => {
          activities.push({
            id: `incident-${incident.id}`,
            action: incident.status === "Resolved" ? "Incident resolved" : "Incident created",
            description: incident.title,
            timestamp: new Date(incident.created_at).toLocaleDateString(),
            user: user.name
          })
        })

      // Recent requests
      const userRequests = requestsData
        .filter(request => request.requester === user.id)
        .slice(0, 2)
        .forEach(request => {
          activities.push({
            id: `request-${request.id}`,
            action: request.status === "Approved" ? "Request approved" : "Request created",
            description: request.title,
            timestamp: new Date(request.created_at).toLocaleDateString(),
            user: user.name
          })
        })

      // Sort by timestamp and take top 10
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivityLog(activities.slice(0, 10))

    } catch (error) {
      console.error('Failed to fetch user data:', error)
      toast.error('Failed to load user data')
    } finally {
      setLoading(false)
    }
  }

  const handleUnassignDevice = async (deviceId: string) => {
    try {
      await assetsApi.update(deviceId, { assigned_to: null, status: "Available" })
      setAssignedDevices(prev => prev.filter(device => device.id !== deviceId))
      toast.success("Device unassigned successfully")
    } catch (error) {
      console.error('Failed to unassign device:', error)
      toast.error('Failed to unassign device')
    }
  }

  const handleAssignNewDevice = () => {
    toast.info("Assign New Device functionality - Would open device assignment modal")
  }

  const handleEditProfile = () => {
    toast.info("Edit Profile functionality - Would open edit profile modal")
  }

  const handleExportProfile = () => {
    try {
      const profileData = {
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        position: user.position,
        employeeId: user.employeeId,
        joinDate: user.joinDate,
        status: user.status,
        assignedDevices: assignedDevices.length,
        assignedProjects: assignedProjects.length,
        documents: documents.length
      }

      const blob = new Blob([JSON.stringify(profileData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${user.name.replace(/\s+/g, '_')}_profile_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success("Profile exported successfully")
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  const handleViewProjectDetails = (projectId: string) => {
    toast.info(`View Project Details for ${projectId} - Would open project details modal`)
  }

  const handleViewDocument = (documentId: string) => {
    toast.info(`View Document ${documentId} - Would open document viewer`)
  }

  const handleUploadDocument = () => {
    toast.info("Upload Document functionality - Would open file upload modal")
  }

  const handleDownloadCard = () => {
    toast.info("Download ID Card functionality - Would generate and download ID card")
  }

  const handleGenerateNewCard = () => {
    toast.info("Generate New ID Card functionality - Would create new ID card")
  }

  const handlePrintCard = () => {
    toast.info("Print ID Card functionality - Would open print dialog")
  }

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
                  <Button variant="outline" size="sm" onClick={handleEditProfile}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExportProfile}>
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
                  {assignedDevices.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Laptop className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No devices assigned</p>
                      <p className="text-sm">Assign devices to this employee</p>
                    </div>
                  ) : (
                    <>
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
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleUnassignDevice(device.id)}
                                >
                                  Unassign
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4">
                        <Button variant="outline" onClick={handleAssignNewDevice}>
                          <Plus className="h-4 w-4 mr-2" />
                          Assign New Device
                        </Button>
                      </div>
                    </>
                  )}
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
                  {assignedProjects.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FolderKanban className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No projects assigned</p>
                      <p className="text-sm">Assign projects to this employee</p>
                    </div>
                  ) : (
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
                              <Progress value={project.progress} className="w-20 mt-1" />
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewProjectDetails(project.id)}
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                  {documents.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No documents uploaded</p>
                      <p className="text-sm">Upload documents for this employee</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewDocument(doc.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Button variant="outline" onClick={handleUploadDocument}>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Document
                        </Button>
                      </div>
                    </>
                  )}
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
                  <div className="space-y-6">
                    {/* ID Card Preview */}
                    <div className="border rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">{user.position}</p>
                          <p className="text-sm text-muted-foreground">{user.department}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.employeeId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Exp: 12/2025</p>
                          <Badge variant="default">Active</Badge>
                        </div>
                      </div>
                    </div>

                    {/* ID Card Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Card Status</Label>
                        <p className="text-sm text-muted-foreground">Active • Expires Dec 2025</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Last Generated</Label>
                        <p className="text-sm text-muted-foreground">January 15, 2024</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Print Count</Label>
                        <p className="text-sm text-muted-foreground">2 times</p>
                      </div>
                    </div>

                    {/* ID Card Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleDownloadCard}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Card
                      </Button>
                      <Button variant="outline" onClick={handleGenerateNewCard}>
                        <Settings className="h-4 w-4 mr-2" />
                        Generate New Card
                      </Button>
                      <Button variant="outline" onClick={handlePrintCard}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Audit log and recent changes</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLog.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No recent activity</p>
                      <p className="text-sm">Activity will appear here as actions are performed</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activityLog.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Activity className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                            <p className="text-xs text-gray-500">by {activity.user}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
