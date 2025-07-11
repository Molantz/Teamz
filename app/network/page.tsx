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
import { AddNetworkDeviceModal } from "@/components/modals/add-network-device-modal"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Wifi,
  Plus,
  Search,
  TrendingUp,
  Settings,
  Activity,
  Zap,
  Globe,
  Server,
  Router,
  Shield,
  Users,
  CreditCard,
  Calendar,
} from "lucide-react"

const networkStats = [
  {
    label: "Network Devices",
    value: "45",
    change: "+3",
    trend: "up",
    icon: Server,
  },
  {
    label: "Active Connections",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Wifi,
  },
  {
    label: "Bandwidth Usage",
    value: "78%",
    change: "+5%",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Security Alerts",
    value: "2",
    change: "-1",
    trend: "down",
    icon: Shield,
  },
]

const networkDevices = [
  {
    id: "NET-001",
    name: "Core Switch - Cisco Catalyst 9300",
    type: "Core Switch",
    location: "Server Room",
    ipAddress: "192.168.1.1",
    status: "Active",
    uptime: "99.9%",
    bandwidth: "85%",
    ports: 48,
    activePorts: 42,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
    firmware: "17.3.4",
    securityStatus: "Secure",
  },
  {
    id: "NET-002",
    name: "Access Point - Aruba AP-515",
    type: "Wireless AP",
    location: "Office Floor 1",
    ipAddress: "192.168.1.10",
    status: "Active",
    uptime: "99.8%",
    bandwidth: "65%",
    ports: 1,
    activePorts: 1,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-04-10",
    firmware: "8.10.0.2",
    securityStatus: "Secure",
  },
  {
    id: "NET-003",
    name: "Router - Cisco ISR 4321",
    type: "Router",
    location: "Network Closet",
    ipAddress: "192.168.1.254",
    status: "Maintenance",
    uptime: "95.2%",
    bandwidth: "92%",
    ports: 4,
    activePorts: 3,
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-02-20",
    firmware: "16.12.4",
    securityStatus: "Warning",
  },
  {
    id: "NET-004",
    name: "Firewall - Fortinet FortiGate 60F",
    type: "Firewall",
    location: "Server Room",
    ipAddress: "192.168.1.2",
    status: "Active",
    uptime: "99.9%",
    bandwidth: "45%",
    ports: 8,
    activePorts: 6,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-04-05",
    firmware: "7.2.5",
    securityStatus: "Secure",
  },
]

export default function NetworkPage() {
  const [addDeviceModal, setAddDeviceModal] = useState(false)
  const [devices, setDevices] = useState<any[]>(networkDevices)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])

  const handleAddDevice = async (data: any) => {
    try {
      const newDevice = {
        id: `NET-${String(devices.length + 1).padStart(3, '0')}`,
        ...data,
        status: "Active",
        uptime: "100%",
        bandwidth: "0%",
        activePorts: 0,
        securityStatus: "Secure",
      }
      
      setDevices([...devices, newDevice])
      toast.success(`Added ${data.name} device`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created network device',
        'network_device',
        newDevice.id,
        `Created device: ${data.name} (${data.type})`
      )
    } catch (error) {
      console.error('Failed to add device:', error)
      toast.error('Failed to add device')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDevices(devices.map(device => device.id))
    } else {
      setSelectedDevices([])
    }
  }

  const handleBulkDelete = () => {
    const devicesToDelete = devices.filter(device => selectedDevices.includes(device.id))
    setDevices(devices.filter(device => !selectedDevices.includes(device.id)))
    setSelectedDevices([])
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted network devices',
      'network_device',
      devicesToDelete.length,
      `Deleted ${devicesToDelete.length} devices: ${devicesToDelete.map(d => d.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const devicesToExport = devices.filter(device => selectedDevices.includes(device.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported network devices',
      'network_device',
      devicesToExport.length,
      `Exported ${devicesToExport.length} devices: ${devicesToExport.map(d => d.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedDevices = devices.map(device => 
      selectedDevices.includes(device.id) 
        ? { ...device, status } 
        : device
    )
    setDevices(updatedDevices)
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated device status to ${status}`,
      'network_device',
      selectedDevices.length,
      `Updated ${selectedDevices.length} devices status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const devicesToEmail = devices.filter(device => selectedDevices.includes(device.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed network devices',
      'network_device',
      devicesToEmail.length,
      `Sent email about ${devicesToEmail.length} devices: ${devicesToEmail.map(d => d.name).join(', ')}`
    )
  }

  return (
    <SidebarInset>
      <Header 
        title="Network Management" 
        description="Manage network devices, monitor connectivity, and track bandwidth usage" 
      />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {networkStats.map((stat) => (
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
          {/* Network Topology */}
          <Card>
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
              <CardDescription>Network infrastructure overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Core Network</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Wireless Network</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">VPN Connections</span>
                  <Badge variant="default">Online</Badge>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common network management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => setAddDeviceModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Network Device
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Network Scan
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Security Audit
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Bandwidth Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest network activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Device maintenance</div>
                <div className="text-muted-foreground">Cisco Router • 2h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Security alert</div>
                <div className="text-muted-foreground">Fortinet Firewall • 4h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New device added</div>
                <div className="text-muted-foreground">Aruba AP • 1d ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Firmware update</div>
                <div className="text-muted-foreground">Core Switch • 2d ago</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Devices Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Network Devices</CardTitle>
                <CardDescription>Manage switches, routers, access points, and firewalls</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search devices..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" onClick={() => setAddDeviceModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedDevices}
                totalItems={devices.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="network devices"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Ports</TableHead>
                    <TableHead>Security</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {device.ipAddress} • {device.firmware}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{device.type}</Badge>
                      </TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            device.status === "Active"
                              ? "default"
                              : device.status === "Maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Uptime: {device.uptime}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span>Bandwidth: {device.bandwidth}</span>
                          </div>
                          <Progress value={parseInt(device.bandwidth)} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{device.activePorts}/{device.ports} Active</div>
                          <div className="text-muted-foreground">
                            {Math.round((device.activePorts / device.ports) * 100)}% utilization
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            device.securityStatus === "Secure"
                              ? "default"
                              : device.securityStatus === "Warning"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {device.securityStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Next: {device.nextMaintenance}</div>
                          <div className="text-muted-foreground">
                            Last: {device.lastMaintenance}
                          </div>
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
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Device</DropdownMenuItem>
                            <DropdownMenuItem>Configure Settings</DropdownMenuItem>
                            <DropdownMenuItem>Update Firmware</DropdownMenuItem>
                            <DropdownMenuItem>Network Diagnostics</DropdownMenuItem>
                            <DropdownMenuItem>Security Settings</DropdownMenuItem>
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

      {/* Add Network Device Modal */}
      <AddNetworkDeviceModal
        open={addDeviceModal}
        onOpenChange={setAddDeviceModal}
        onSubmit={handleAddDevice}
      />
    </SidebarInset>
  )
} 