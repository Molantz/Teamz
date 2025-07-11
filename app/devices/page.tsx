"use client"

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
import { Filter, Laptop, MoreHorizontal, Plus, QrCode, Search, Smartphone, Monitor, Calendar, User } from "lucide-react"

const devices = [
  {
    id: "DEV-001",
    name: "Dell Latitude 7420",
    type: "Laptop",
    serialNumber: "DL7420-001-2024",
    assignedTo: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    department: "IT",
    status: "Active",
    condition: "Excellent",
    purchaseDate: "2024-01-15",
    warrantyExpiry: "2027-01-15",
    lastMaintenance: "2024-12-01",
    nextMaintenance: "2025-03-01",
    icon: Laptop,
  },
  {
    id: "DEV-002",
    name: "iPhone 14 Pro",
    type: "Mobile",
    serialNumber: "IP14P-002-2024",
    assignedTo: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    department: "HR",
    status: "Active",
    condition: "Good",
    purchaseDate: "2024-02-20",
    warrantyExpiry: "2026-02-20",
    lastMaintenance: "N/A",
    nextMaintenance: "N/A",
    icon: Smartphone,
  },
  {
    id: "DEV-003",
    name: "Dell UltraSharp 27",
    type: "Monitor",
    serialNumber: "DU27-003-2024",
    assignedTo: {
      name: "Mike Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    department: "Engineering",
    status: "Active",
    condition: "Excellent",
    purchaseDate: "2024-03-10",
    warrantyExpiry: "2027-03-10",
    lastMaintenance: "2024-11-15",
    nextMaintenance: "2025-05-15",
    icon: Monitor,
  },
  {
    id: "DEV-004",
    name: "MacBook Pro 16",
    type: "Laptop",
    serialNumber: "MBP16-004-2024",
    assignedTo: null,
    department: "Unassigned",
    status: "Available",
    condition: "New",
    purchaseDate: "2024-12-01",
    warrantyExpiry: "2027-12-01",
    lastMaintenance: "N/A",
    nextMaintenance: "2025-06-01",
    icon: Laptop,
  },
]

const deviceStats = [
  { label: "Total Devices", value: "892", change: "+23" },
  { label: "Active Devices", value: "756", change: "+18" },
  { label: "Available", value: "89", change: "+5" },
  { label: "Maintenance Due", value: "12", change: "+3" },
]

export default function DevicesPage() {
  return (
    <SidebarInset>
      <Header title="Device Management" description="Track and manage all IT devices and equipment assignments" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {deviceStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Laptop className="h-4 w-4 text-blue-600" />
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
                  <span>756</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Expiring Soon</span>
                  <span>23</span>
                </div>
                <Progress value={15} className="h-2 [&>div]:bg-yellow-500" />
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
                  <span>456</span>
                </div>
                <Progress value={60} className="h-2 [&>div]:bg-green-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Good</span>
                  <span>234</span>
                </div>
                <Progress value={30} className="h-2 [&>div]:bg-blue-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Fair</span>
                  <span>78</span>
                </div>
                <Progress value={10} className="h-2 [&>div]:bg-yellow-500" />
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
                  <Input placeholder="Search devices..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Next Maintenance</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <device.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {device.id} • {device.serialNumber}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{device.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {device.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={device.assignedTo.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {device.assignedTo.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{device.assignedTo.name}</div>
                            <div className="text-xs text-muted-foreground">{device.department}</div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span className="text-sm">Unassigned</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={device.status === "Active" ? "default" : "secondary"}>{device.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          device.condition === "Excellent"
                            ? "default"
                            : device.condition === "Good"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {device.condition}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{device.nextMaintenance}</span>
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
                          <DropdownMenuItem>Assign User</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                          <DropdownMenuItem>
                            <QrCode className="h-3 w-3 mr-2" />
                            Generate QR Code
                          </DropdownMenuItem>
                          <DropdownMenuItem>View History</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Retire Device</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
