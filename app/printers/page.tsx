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
import { AddPrinterModal } from "@/components/modals/add-printer-modal"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Printer,
  Plus,
  Search,
  TrendingUp,
  Settings,
  Wrench,
  FileText,
  Activity,
  Zap,
  Users,
  CreditCard,
  Calendar,
} from "lucide-react"

const printerStats = [
  {
    label: "Total Printers",
    value: "24",
    change: "+2",
    trend: "up",
    icon: Printer,
  },
  {
    label: "Active Printers",
    value: "22",
    change: "+1",
    trend: "up",
    icon: Activity,
  },
  {
    label: "Maintenance Due",
    value: "3",
    change: "-1",
    trend: "down",
    icon: Wrench,
  },
  {
    label: "Monthly Print Jobs",
    value: "12,450",
    change: "+15%",
    trend: "up",
    icon: FileText,
  },
]

const printerTypes = [
  { name: "Laser Printers", count: 12, percentage: 50 },
  { name: "Inkjet Printers", count: 6, percentage: 25 },
  { name: "Multifunction", count: 4, percentage: 17 },
  { name: "Network Printers", count: 2, percentage: 8 },
]

const printers = [
  {
    id: "PRN-001",
    name: "HP LaserJet Pro M404n",
    type: "Laser Printer",
    location: "IT Department",
    ipAddress: "192.168.1.100",
    status: "Active",
    assignedTo: "IT Support",
    totalPrints: 15420,
    monthlyPrints: 1250,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-02-15",
    tonerLevel: 85,
    paperLevel: 90,
    networkStatus: "Online",
    printQueue: 3,
  },
  {
    id: "PRN-002",
    name: "Canon PIXMA TR4520",
    type: "Inkjet Printer",
    location: "Marketing",
    ipAddress: "192.168.1.101",
    status: "Maintenance",
    assignedTo: "Marketing Team",
    totalPrints: 8920,
    monthlyPrints: 680,
    lastMaintenance: "2024-01-10",
    nextMaintenance: "2024-02-10",
    tonerLevel: 15,
    paperLevel: 60,
    networkStatus: "Online",
    printQueue: 0,
  },
  {
    id: "PRN-003",
    name: "Brother MFC-L3770CDW",
    type: "Multifunction",
    location: "Reception",
    ipAddress: "192.168.1.102",
    status: "Active",
    assignedTo: "Reception",
    totalPrints: 23450,
    monthlyPrints: 2100,
    lastMaintenance: "2024-01-20",
    nextMaintenance: "2024-02-20",
    tonerLevel: 45,
    paperLevel: 75,
    networkStatus: "Online",
    printQueue: 8,
  },
  {
    id: "PRN-004",
    name: "Epson WorkForce Pro WF-3720",
    type: "Network Printer",
    location: "Conference Room",
    ipAddress: "192.168.1.103",
    status: "Offline",
    assignedTo: "General Use",
    totalPrints: 18760,
    monthlyPrints: 1450,
    lastMaintenance: "2024-01-05",
    nextMaintenance: "2024-02-05",
    tonerLevel: 0,
    paperLevel: 0,
    networkStatus: "Offline",
    printQueue: 0,
  },
]

export default function PrintersPage() {
  const [addPrinterModal, setAddPrinterModal] = useState(false)
  const [printerList, setPrinterList] = useState<any[]>(printers)
  const [selectedPrinters, setSelectedPrinters] = useState<string[]>([])

  const handleAddPrinter = async (data: any) => {
    try {
      const newPrinter = {
        id: `PRN-${String(printerList.length + 1).padStart(3, '0')}`,
        ...data,
        status: "Active",
        totalPrints: 0,
        monthlyPrints: 0,
        tonerLevel: 100,
        paperLevel: 100,
        networkStatus: "Online",
        printQueue: 0,
      }
      
      setPrinterList([...printerList, newPrinter])
      toast.success(`Added ${data.name} printer`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created printer',
        'printer',
        newPrinter.id,
        `Created printer: ${data.name} (${data.type})`
      )
    } catch (error) {
      console.error('Failed to add printer:', error)
      toast.error('Failed to add printer')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPrinters(printerList.map(printer => printer.id))
    } else {
      setSelectedPrinters([])
    }
  }

  const handleBulkDelete = () => {
    const printersToDelete = printerList.filter(printer => selectedPrinters.includes(printer.id))
    setPrinterList(printerList.filter(printer => !selectedPrinters.includes(printer.id)))
    setSelectedPrinters([])
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted printers',
      'printer',
      printersToDelete.length,
      `Deleted ${printersToDelete.length} printers: ${printersToDelete.map(p => p.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const printersToExport = printerList.filter(printer => selectedPrinters.includes(printer.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported printers',
      'printer',
      printersToExport.length,
      `Exported ${printersToExport.length} printers: ${printersToExport.map(p => p.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedPrinters = printerList.map(printer => 
      selectedPrinters.includes(printer.id) 
        ? { ...printer, status } 
        : printer
    )
    setPrinterList(updatedPrinters)
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated printer status to ${status}`,
      'printer',
      selectedPrinters.length,
      `Updated ${selectedPrinters.length} printers status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const printersToEmail = printerList.filter(printer => selectedPrinters.includes(printer.id))
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed printers',
      'printer',
      printersToEmail.length,
      `Sent email about ${printersToEmail.length} printers: ${printersToEmail.map(p => p.name).join(', ')}`
    )
  }

  return (
    <SidebarInset>
      <Header 
        title="Printer Management" 
        description="Manage printers, consumables, maintenance schedules, and print job monitoring" 
      />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {printerStats.map((stat) => (
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
          {/* Printer Types Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Printer Types</CardTitle>
              <CardDescription>Distribution of printer types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {printerTypes.map((type) => (
                <div key={type.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{type.name}</span>
                    <span className="text-muted-foreground">{type.count}</span>
                  </div>
                  <Progress value={type.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common printer management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => setAddPrinterModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Printer
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Toner Alerts
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Print Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest printer activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Maintenance completed</div>
                <div className="text-muted-foreground">HP LaserJet Pro • 2h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Toner replaced</div>
                <div className="text-muted-foreground">Canon PIXMA • 4h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Printer offline</div>
                <div className="text-muted-foreground">Epson WorkForce • 1d ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New printer added</div>
                <div className="text-muted-foreground">Brother MFC • 2d ago</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Printers Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Printers</CardTitle>
                <CardDescription>Manage printers, consumables, and maintenance</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search printers..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" onClick={() => setAddPrinterModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Printer
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedPrinters}
                totalItems={printerList.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="printers"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Printer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Network Status</TableHead>
                    <TableHead>Consumables</TableHead>
                    <TableHead>Print Jobs</TableHead>
                    <TableHead>Maintenance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printerList.map((printer) => (
                    <TableRow key={printer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{printer.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {printer.ipAddress} • {printer.assignedTo}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{printer.type}</Badge>
                      </TableCell>
                      <TableCell>{printer.location}</TableCell>
                      <TableCell>
                        <Badge
                          variant={printer.networkStatus === "Online" ? "default" : "destructive"}
                        >
                          {printer.networkStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Toner: {printer.tonerLevel}%</span>
                          </div>
                          <Progress value={printer.tonerLevel} className="h-1" />
                          <div className="flex items-center justify-between text-sm">
                            <span>Paper: {printer.paperLevel}%</span>
                          </div>
                          <Progress value={printer.paperLevel} className="h-1" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Queue: {printer.printQueue}</div>
                          <div className="text-muted-foreground">
                            {printer.monthlyPrints.toLocaleString()} this month
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>Next: {printer.nextMaintenance}</div>
                          <div className="text-muted-foreground">
                            Last: {printer.lastMaintenance}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            printer.status === "Active"
                              ? "default"
                              : printer.status === "Maintenance"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {printer.status}
                        </Badge>
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
                            <DropdownMenuItem>Edit Printer</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                            <DropdownMenuItem>Replace Consumables</DropdownMenuItem>
                            <DropdownMenuItem>Print Test Page</DropdownMenuItem>
                            <DropdownMenuItem>Network Settings</DropdownMenuItem>
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

      {/* Add Printer Modal */}
      <AddPrinterModal
        open={addPrinterModal}
        onOpenChange={setAddPrinterModal}
        onSubmit={handleAddPrinter}
      />
    </SidebarInset>
  )
} 