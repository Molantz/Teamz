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
import { AddInventoryModal } from "@/components/modals/add-inventory-modal"
import { BulkActions } from "@/components/bulk-actions"
import { auditLogger } from "@/lib/audit-log"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Filter,
  Laptop,
  MoreHorizontal,
  Package,
  Plus,
  Printer,
  Search,
  Server,
  Smartphone,
  TrendingUp,
  Cloud,
  FileText,
  Wrench,
} from "lucide-react"

const inventoryItems = [
  {
    id: "INV-001",
    name: "Dell Latitude 7420",
    category: "Laptops",
    quantity: 45,
    available: 12,
    assigned: 33,
    status: "In Stock",
    location: "Warehouse A",
    cost: "$1,200",
    supplier: "Dell Inc.",
    icon: Laptop,
  },
  {
    id: "INV-002",
    name: "HP LaserJet Pro",
    category: "Printers",
    quantity: 8,
    available: 2,
    assigned: 6,
    status: "Low Stock",
    location: "Office Floor 2",
    cost: "$450",
    supplier: "HP Inc.",
    icon: Printer,
  },
  {
    id: "INV-003",
    name: "iPhone 14 Pro",
    category: "Mobile Devices",
    quantity: 25,
    available: 8,
    assigned: 17,
    status: "In Stock",
    location: "Secure Storage",
    cost: "$999",
    supplier: "Apple Inc.",
    icon: Smartphone,
  },
  {
    id: "INV-004",
    name: "Dell PowerEdge R740",
    category: "Servers",
    quantity: 3,
    available: 0,
    assigned: 3,
    status: "Out of Stock",
    location: "Data Center",
    cost: "$4,500",
    supplier: "Dell Inc.",
    icon: Server,
  },
  {
    id: "INV-005",
    name: "Printer Toner Cartridges",
    category: "Consumables",
    quantity: 150,
    available: 45,
    assigned: 105,
    status: "In Stock",
    location: "Supply Room",
    cost: "$85",
    supplier: "HP Inc.",
    icon: Package,
  },
  {
    id: "INV-006",
    name: "Network Cables (Cat6)",
    category: "Consumables",
    quantity: 500,
    available: 200,
    assigned: 300,
    status: "In Stock",
    location: "Network Storage",
    cost: "$12",
    supplier: "CableCo",
    icon: Package,
  },
  {
    id: "INV-007",
    name: "Microsoft Office 365",
    category: "Software",
    quantity: 500,
    available: 50,
    assigned: 450,
    status: "In Stock",
    location: "Digital License",
    cost: "$15/month",
    supplier: "Microsoft",
    icon: Package,
  },
  {
    id: "INV-008",
    name: "Adobe Creative Suite",
    category: "Software",
    quantity: 25,
    available: 5,
    assigned: 20,
    status: "Low Stock",
    location: "Digital License",
    cost: "$52/month",
    supplier: "Adobe",
    icon: Package,
  },
  {
    id: "INV-009",
    name: "Cloud Backup Service",
    category: "Services",
    quantity: 1,
    available: 1,
    assigned: 0,
    status: "Active",
    location: "Cloud",
    cost: "$2,500/month",
    supplier: "AWS",
    icon: Server,
  },
  {
    id: "INV-010",
    name: "IT Support Contract",
    category: "Services",
    quantity: 1,
    available: 1,
    assigned: 0,
    status: "Active",
    location: "External",
    cost: "$5,000/month",
    supplier: "TechSupport Pro",
    icon: Server,
  },
]

const inventoryStats = [
  {
    label: "Total Assets",
    value: "2,847",
    change: "+156",
    trend: "up",
    icon: Package,
  },
  {
    label: "Available",
    value: "1,234",
    change: "-23",
    trend: "down",
    icon: TrendingUp,
  },
  {
    label: "Assigned",
    value: "1,456",
    change: "+89",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "Low Stock Items",
    value: "12",
    change: "+3",
    trend: "up",
    icon: AlertTriangle,
  },
]

const categoryBreakdown = [
  { name: "Laptops", count: 245, percentage: 25 },
  { name: "Desktops", count: 189, percentage: 19 },
  { name: "Mobile Devices", count: 156, percentage: 16 },
  { name: "Consumables", count: 234, percentage: 24 },
  { name: "Software", count: 125, percentage: 13 },
  { name: "Services", count: 45, percentage: 3 },
]

export default function InventoryPage() {
  const [addInventoryModal, setAddInventoryModal] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('/api/inventory')
        const data = await response.json()
        setInventoryItems(data)
      } catch (error) {
        console.error('Failed to fetch inventory:', error)
        toast.error('Failed to load inventory items')
      } finally {
        setLoading(false)
      }
    }
    fetchInventory()
  }, [])

  const handleAddInventory = async (data: any) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        const newItem = await response.json()
        setInventoryItems([...inventoryItems, newItem])
        toast.success(`Added ${data.name} to inventory`)
        
        // Log the action
        auditLogger.logUserAction(
          'current-user',
          'Current User',
          'Created inventory item',
          'inventory',
          newItem.id,
          `Created inventory item: ${data.name} (${data.category})`
        )
      } else {
        toast.error('Failed to add inventory item')
      }
    } catch (error) {
      console.error('Failed to add inventory item:', error)
      toast.error('Failed to add inventory item')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(inventoryItems.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleBulkDelete = () => {
    const itemsToDelete = inventoryItems.filter(item => selectedItems.includes(item.id))
    setInventoryItems(inventoryItems.filter(item => !selectedItems.includes(item.id)))
    setSelectedItems([])
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted inventory items',
      'inventory',
      itemsToDelete.length,
      `Deleted ${itemsToDelete.length} inventory items: ${itemsToDelete.map(item => item.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const itemsToExport = inventoryItems.filter(item => selectedItems.includes(item.id))
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported inventory items',
      'inventory',
      itemsToExport.length,
      `Exported ${itemsToExport.length} inventory items: ${itemsToExport.map(item => item.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedItems = inventoryItems.map(item => 
      selectedItems.includes(item.id) 
        ? { ...item, status } 
        : item
    )
    setInventoryItems(updatedItems)
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated inventory status to ${status}`,
      'inventory',
      selectedItems.length,
      `Updated ${selectedItems.length} inventory items status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const itemsToEmail = inventoryItems.filter(item => selectedItems.includes(item.id))
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed inventory items',
      'inventory',
      itemsToEmail.length,
      `Sent email about ${itemsToEmail.length} inventory items: ${itemsToEmail.map(item => item.name).join(', ')}`
    )
  }

  return (
    <SidebarInset>
      <Header title="IT Inventory" description="Manage and track all IT assets, devices, and equipment" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {inventoryStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon
                  className={`h-4 w-4 ${stat.label === "Low Stock Items" ? "text-red-600" : "text-blue-600"}`}
                />
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
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
              <CardDescription>Asset distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categoryBreakdown.map((category) => (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{category.name}</span>
                    <span className="text-muted-foreground">{category.count}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common inventory tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => setAddInventoryModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Asset
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Add Consumable
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Add Software
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Cloud className="h-4 w-4 mr-2" />
                Add Service
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Stock Alerts
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest inventory movements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Dell Laptop assigned</div>
                <div className="text-muted-foreground">to John Smith • 2h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New consumables received</div>
                <div className="text-muted-foreground">50 toner cartridges • 4h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Software license renewed</div>
                <div className="text-muted-foreground">Adobe Creative Suite • 1d ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Service contract updated</div>
                <div className="text-muted-foreground">Cloud backup service • 2d ago</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Inventory Items</CardTitle>
                <CardDescription>Complete list of IT assets and equipment</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search inventory..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" onClick={() => setAddInventoryModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedItems}
                totalItems={inventoryItems.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="inventory items"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.id} • {item.cost}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{item.available}</span>
                        <div className="w-16">
                          <Progress value={(item.available / item.quantity) * 100} className="h-1" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === "In Stock"
                            ? "default"
                            : item.status === "Low Stock"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.location}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Asset</DropdownMenuItem>
                          <DropdownMenuItem>Assign Device</DropdownMenuItem>
                          <DropdownMenuItem>Move Location</DropdownMenuItem>
                          <DropdownMenuItem>Generate QR Code</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Retire Asset</DropdownMenuItem>
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

      {/* Add Inventory Modal */}
      <AddInventoryModal
        open={addInventoryModal}
        onOpenChange={setAddInventoryModal}
        onSubmit={handleAddInventory}
      />
    </SidebarInset>
  )
}
