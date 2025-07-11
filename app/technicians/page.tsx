"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { BulkActions } from "@/components/bulk-actions"
import { auditLogger } from "@/lib/audit-log"
import { AddTechnicianModal } from "@/components/modals/add-technician-modal"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Filter,
  MoreHorizontal,
  UserCheck,
  Plus,
  Search,
  TrendingUp,
  Settings,
  Activity,
  Zap,
  Wrench,
  Clock,
  Star,
  Users,
  CreditCard,
  Calendar,
  MapPin,
} from "lucide-react"

const technicianStats = [
  {
    label: "Total Technicians",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Users,
  },
  {
    label: "Active Work Orders",
    value: "28",
    change: "+5",
    trend: "up",
    icon: Wrench,
  },
  {
    label: "Avg Response Time",
    value: "2.3h",
    change: "-0.5h",
    trend: "down",
    icon: Clock,
  },
  {
    label: "Customer Satisfaction",
    value: "4.8/5",
    change: "+0.2",
    trend: "up",
    icon: Star,
  },
]

const technicianSkills = [
  { name: "Hardware Repair", count: 8, percentage: 67 },
  { name: "Network Configuration", count: 6, percentage: 50 },
  { name: "Software Installation", count: 10, percentage: 83 },
  { name: "Printer Maintenance", count: 4, percentage: 33 },
]

const technicians = [
  {
    id: "TEC-001",
    name: "John Smith",
    role: "Senior IT Technician",
    department: "IT Support",
    location: "Head Office",
    status: "Available",
    skills: ["Hardware Repair", "Network Configuration", "Software Installation"],
    currentAssignment: "Device setup - Marketing Dept",
    workOrdersCompleted: 156,
    avgResponseTime: "1.8h",
    rating: 4.9,
    phoneNumber: "+2348012345678",
    email: "john.smith@company.com",
    lastActive: "2024-01-25 14:30",
    availability: "Mon-Fri, 8AM-6PM",
  },
  {
    id: "TEC-002",
    name: "Sarah Johnson",
    role: "Network Technician",
    department: "Network Team",
    location: "Branch Office",
    status: "On Assignment",
    skills: ["Network Configuration", "Hardware Repair"],
    currentAssignment: "Network upgrade - Branch Office",
    workOrdersCompleted: 89,
    avgResponseTime: "2.1h",
    rating: 4.7,
    phoneNumber: "+2348098765432",
    email: "sarah.johnson@company.com",
    lastActive: "2024-01-25 15:45",
    availability: "Mon-Fri, 9AM-5PM",
  },
  {
    id: "TEC-003",
    name: "Mike Wilson",
    role: "Printer Technician",
    department: "Hardware Support",
    location: "Head Office",
    status: "Available",
    skills: ["Printer Maintenance", "Hardware Repair"],
    currentAssignment: "Printer maintenance - IT Dept",
    workOrdersCompleted: 203,
    avgResponseTime: "1.5h",
    rating: 4.8,
    phoneNumber: "+2348055555555",
    email: "mike.wilson@company.com",
    lastActive: "2024-01-25 16:20",
    availability: "Mon-Fri, 8AM-6PM",
  },
  {
    id: "TEC-004",
    name: "Lisa Brown",
    role: "Software Technician",
    department: "Software Support",
    location: "Remote",
    status: "On Break",
    skills: ["Software Installation", "Network Configuration"],
    currentAssignment: "Software deployment - Sales Dept",
    workOrdersCompleted: 134,
    avgResponseTime: "2.8h",
    rating: 4.6,
    phoneNumber: "+2348077777777",
    email: "lisa.brown@company.com",
    lastActive: "2024-01-25 13:15",
    availability: "Mon-Fri, 10AM-6PM",
  },
]

export default function TechniciansPage() {
  const [addTechnicianModal, setAddTechnicianModal] = useState(false)
  const [technicianList, setTechnicianList] = useState<any[]>(technicians)
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([])

  const handleAddTechnician = async (data: any) => {
    try {
      const newTechnician = {
        id: `TEC-${String(technicianList.length + 1).padStart(3, '0')}`,
        ...data,
        status: "Available",
        workOrdersCompleted: 0,
        avgResponseTime: "0h",
        rating: 0,
        lastActive: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }
      
      setTechnicianList([...technicianList, newTechnician])
      toast.success(`Added ${data.name} technician`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created technician',
        'technician',
        newTechnician.id,
        `Created technician: ${data.name} (${data.role})`
      )
    } catch (error) {
      console.error('Failed to add technician:', error)
      toast.error('Failed to add technician')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTechnicians(technicianList.map(technician => technician.id))
    } else {
      setSelectedTechnicians([])
    }
  }

  const handleBulkDelete = () => {
    const techniciansToDelete = technicianList.filter(technician => selectedTechnicians.includes(technician.id))
    setTechnicianList(technicianList.filter(technician => !selectedTechnicians.includes(technician.id)))
    setSelectedTechnicians([])
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted technicians',
      'technician',
      techniciansToDelete.length,
      `Deleted ${techniciansToDelete.length} technicians: ${techniciansToDelete.map(t => t.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const techniciansToExport = technicianList.filter(technician => selectedTechnicians.includes(technician.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported technicians',
      'technician',
      techniciansToExport.length,
      `Exported ${techniciansToExport.length} technicians: ${techniciansToExport.map(t => t.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedTechnicians = technicianList.map(technician => 
      selectedTechnicians.includes(technician.id) 
        ? { ...technician, status } 
        : technician
    )
    setTechnicianList(updatedTechnicians)
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated technician status to ${status}`,
      'technician',
      selectedTechnicians.length,
      `Updated ${selectedTechnicians.length} technicians status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const techniciansToEmail = technicianList.filter(technician => selectedTechnicians.includes(technician.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed technicians',
      'technician',
      techniciansToEmail.length,
      `Sent email to ${techniciansToEmail.length} technicians: ${techniciansToEmail.map(t => t.name).join(', ')}`
    )
  }

  return (
    <SidebarInset>
      <Header 
        title="Technician Management" 
        description="Manage IT technicians, track assignments, and monitor performance" 
      />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {technicianStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span> from
                  last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Skills Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Distribution</CardTitle>
              <CardDescription>Technician skills overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {technicianSkills.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.count}</span>
                  </div>
                  <Progress value={skill.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common technician management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => setAddTechnicianModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Technician
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Assign Work Order
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Performance Review
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Skills Assessment
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest technician activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Work order completed</div>
                <div className="text-muted-foreground">John Smith • 2h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New assignment</div>
                <div className="text-muted-foreground">Sarah Johnson • 4h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Performance review</div>
                <div className="text-muted-foreground">Mike Wilson • 1d ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Skills updated</div>
                <div className="text-muted-foreground">Lisa Brown • 2d ago</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technicians Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Technicians</CardTitle>
                <CardDescription>Manage IT technicians and track their assignments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search technicians..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" onClick={() => setAddTechnicianModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Technician
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedTechnicians}
                totalItems={technicianList.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="technicians"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Current Assignment</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicianList.map((technician) => (
                    <TableRow key={technician.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{technician.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {technician.department} • {technician.availability}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{technician.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {technician.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            technician.status === "Available"
                              ? "default"
                              : technician.status === "On Assignment"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {technician.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {technician.skills.slice(0, 2).map((skill: string) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {technician.skills.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{technician.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span>{technician.rating}/5</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {technician.workOrdersCompleted} orders • {technician.avgResponseTime} avg
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">{technician.currentAssignment}</div>
                          <div className="text-muted-foreground">
                            Last active: {technician.lastActive}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{technician.phoneNumber}</div>
                          <div className="text-muted-foreground">{technician.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Technician</DropdownMenuItem>
                            <DropdownMenuItem>Assign Work Order</DropdownMenuItem>
                            <DropdownMenuItem>Performance Review</DropdownMenuItem>
                            <DropdownMenuItem>Skills Assessment</DropdownMenuItem>
                            <DropdownMenuItem>Contact Technician</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Technician Modal */}
      <AddTechnicianModal
        open={addTechnicianModal}
        onOpenChange={setAddTechnicianModal}
        onSubmit={handleAddTechnician}
      />
    </SidebarInset>
  )
} 