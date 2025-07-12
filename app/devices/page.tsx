"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { Filter, Laptop, MoreHorizontal, Plus, QrCode, Search, Smartphone, Monitor, Calendar, User as UserIcon, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { assetsApi, usersApi } from "@/lib/api"
import { Asset, User } from "@/lib/supabase"

// Device type mapping
const getDeviceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'laptop':
      return Laptop
    case 'mobile':
    case 'smartphone':
      return Smartphone
    case 'monitor':
    case 'display':
      return Monitor
    default:
      return Laptop
  }
}

export default function DevicesPage() {
  const [addDeviceModal, setAddDeviceModal] = useState(false)
  const [assignDeviceModal, setAssignDeviceModal] = useState(false)
  const [deviceDetailsModal, setDeviceDetailsModal] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Asset | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Real-time data
  const { data: devices, loading: devicesLoading, error: devicesError, refresh: refreshDevices } = useRealtime<Asset>({
    table: 'assets',
    onDataChange: (payload) => {
      console.log('Device data changed:', payload)
      toast.success('Device data updated in real-time')
    }
  })

  const { data: users, loading: usersLoading, error: usersError } = useRealtime<User>({
    table: 'users'
  })

  // Calculate real-time stats
  const deviceStatsData = [
    { 
      label: "Total Devices", 
      value: devices.length.toString(), 
      change: "+23",
      icon: Laptop 
    },
    { 
      label: "Active Devices", 
      value: devices.filter(d => d.status === "Assigned" || d.status === "Active").length.toString(), 
      change: "+18",
      icon: Laptop 
    },
    { 
      label: "Available", 
      value: devices.filter(d => d.status === "Available").length.toString(), 
      change: "+5",
      icon: Laptop 
    },
    { 
      label: "Maintenance Due", 
      value: devices.filter(d => d.status === "Maintenance").length.toString(), 
      change: "+3",
      icon: Laptop 
    },
  ]

  // Filter devices based on search and filters
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.serial_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || device.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === "all" || device.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate warranty and maintenance stats
  const warrantyStats = {
    active: devices.filter(d => {
      if (!d.warranty_expiry) return false
      const expiry = new Date(d.warranty_expiry)
      const now = new Date()
      return expiry > now
    }).length,
    expiringSoon: devices.filter(d => {
      if (!d.warranty_expiry) return false
      const expiry = new Date(d.warranty_expiry)
      const now = new Date()
      const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      return expiry <= thirtyDaysFromNow && expiry > now
    }).length
  }

  const conditionStats = {
    excellent: devices.filter(d => d.status === "Excellent" || d.status === "New").length,
    good: devices.filter(d => d.status === "Good").length,
    fair: devices.filter(d => d.status === "Fair" || d.status === "Maintenance").length
  }

  const handleAddDevice = async (deviceData: any) => {
    try {
      await assetsApi.create(deviceData)
      toast.success('Device added successfully')
      refreshDevices()
    } catch (error) {
      console.error('Failed to add device:', error)
      toast.error('Failed to add device')
    }
  }

  const handleAssignDevice = async (assignmentData: any) => {
    try {
      // Update device status and assignment
      await assetsApi.update(assignmentData.deviceId, {
        status: "Assigned",
        assigned_to: assignmentData.userId
      })
      toast.success('Device assigned successfully')
      refreshDevices()
    } catch (error) {
      console.error('Failed to assign device:', error)
      toast.error('Failed to assign device')
    }
  }

  const handleDeviceAction = (device: Asset, action: string) => {
    setSelectedDevice(device)
    switch (action) {
      case 'assign':
        setAssignDeviceModal(true)
        break
      case 'details':
        setDeviceDetailsModal(true)
        break
      default:
        break
    }
  }

  if (devicesError || usersError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Device Management" description="Track and manage all IT devices and equipment assignments" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading devices</div>
                <Button onClick={refreshDevices} variant="outline">Retry</Button>
              </div>
            </div>
          </div>
        </SidebarInset>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <SidebarInset>
        <Header title="Device Management" description="Track and manage all IT devices and equipment assignments" />
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {deviceStatsData.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Device Lifecycle Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Warranty Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Active Warranties</span>
                    <span>{warrantyStats.active}</span>
                  </div>
                  <Progress value={warrantyStats.active > 0 ? (warrantyStats.active / devices.length) * 100 : 0} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Expiring Soon</span>
                    <span>{warrantyStats.expiringSoon}</span>
                  </div>
                  <Progress value={warrantyStats.expiringSoon > 0 ? (warrantyStats.expiringSoon / devices.length) * 100 : 0} className="h-2 [&>div]:bg-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Device Condition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Excellent</span>
                    <span>{conditionStats.excellent}</span>
                  </div>
                  <Progress value={conditionStats.excellent > 0 ? (conditionStats.excellent / devices.length) * 100 : 0} className="h-2 [&>div]:bg-green-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Good</span>
                    <span>{conditionStats.good}</span>
                  </div>
                  <Progress value={conditionStats.good > 0 ? (conditionStats.good / devices.length) * 100 : 0} className="h-2 [&>div]:bg-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fair</span>
                    <span>{conditionStats.fair}</span>
                  </div>
                  <Progress value={conditionStats.fair > 0 ? (conditionStats.fair / devices.length) * 100 : 0} className="h-2 [&>div]:bg-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">This Week</div>
                  <div className="text-muted-foreground">5 devices scheduled</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Next Week</div>
                  <div className="text-muted-foreground">8 devices scheduled</div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Overdue</div>
                  <div className="text-red-600">2 devices overdue</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Devices Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Device Registry</CardTitle>
                  <CardDescription>Complete device inventory with assignments and maintenance</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search devices..." 
                      className="w-[250px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterType("all")}>
                        All Types
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("laptop")}>
                        Laptops
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("mobile")}>
                        Mobile Devices
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("monitor")}>
                        Monitors
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" onClick={() => setAddDeviceModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Device
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {devicesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading devices...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Device</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Warranty</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevices.map((device) => {
                      const assignedUser = users.find(u => u.id === device.assigned_to)
                      const DeviceIcon = getDeviceIcon(device.type)
                      
                      return (
                        <TableRow key={device.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <DeviceIcon className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium">{device.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {device.serial_number}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{device.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {assignedUser ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignedUser.avatar || ""} />
                                  <AvatarFallback>{assignedUser.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{assignedUser.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={device.status === "Available" ? "default" : 
                                     device.status === "Assigned" ? "secondary" : "destructive"}
                            >
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {device.warranty_expiry ? (
                              <div className="text-sm">
                                <div>Expires {new Date(device.warranty_expiry).toLocaleDateString()}</div>
                                <div className="text-muted-foreground">
                                  {Math.ceil((new Date(device.warranty_expiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">No warranty</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleDeviceAction(device, 'details')}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeviceAction(device, 'assign')}>
                                  Assign Device
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <QrCode className="h-4 w-4 mr-2" />
                                  Generate QR Code
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* TODO: Add modals when components are created */}
      </SidebarInset>
    </ProtectedRoute>
  )
}
