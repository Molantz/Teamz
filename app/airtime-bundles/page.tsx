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
import { AddBundleModal } from "@/components/modals/add-bundle-modal"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Filter,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  TrendingUp,
  Smartphone,
  Wifi,
  Globe,
  Users,
  CreditCard,
  Calendar,
  Activity,
} from "lucide-react"

const bundleStats = [
  {
    label: "Active Bundles",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Package,
  },
  {
    label: "Total Data Used",
    value: "2.4TB",
    change: "+18%",
    trend: "up",
    icon: Wifi,
  },
  {
    label: "Active Users",
    value: "89",
    change: "+5",
    trend: "up",
    icon: Users,
  },
  {
    label: "Monthly Cost",
    value: "$3,450",
    change: "-8%",
    trend: "down",
    icon: CreditCard,
  },
]

const bundleTypes = [
  { name: "Data Only", count: 45, percentage: 35 },
  { name: "Voice + Data", count: 67, percentage: 52 },
  { name: "Unlimited", count: 23, percentage: 18 },
  { name: "International", count: 12, percentage: 9 },
]

const airtimeBundles = [
  {
    id: "BUN-001",
    name: "Corporate Data Plan",
    type: "Data Only",
    provider: "MTN",
    dataLimit: "10GB",
    dataUsed: "7.2GB",
    voiceMinutes: 0,
    voiceUsed: 0,
    validity: "30 days",
    cost: "$25/month",
    status: "Active",
    assignedTo: "John Smith",
    phoneNumber: "+2348012345678",
    expiryDate: "2024-02-15",
    autoRenew: true,
  },
  {
    id: "BUN-002",
    name: "Executive Voice+Data",
    type: "Voice + Data",
    provider: "Airtel",
    dataLimit: "15GB",
    dataUsed: "12.8GB",
    voiceMinutes: 1000,
    voiceUsed: 450,
    validity: "30 days",
    cost: "$45/month",
    status: "Active",
    assignedTo: "Sarah Johnson",
    phoneNumber: "+2348098765432",
    expiryDate: "2024-02-20",
    autoRenew: true,
  },
  {
    id: "BUN-003",
    name: "Unlimited Corporate",
    type: "Unlimited",
    provider: "Glo",
    dataLimit: "Unlimited",
    dataUsed: "25.6GB",
    voiceMinutes: "Unlimited",
    voiceUsed: 1200,
    validity: "30 days",
    cost: "$75/month",
    status: "Active",
    assignedTo: "Mike Wilson",
    phoneNumber: "+2348055555555",
    expiryDate: "2024-02-25",
    autoRenew: true,
  },
  {
    id: "BUN-004",
    name: "International Roaming",
    type: "International",
    provider: "MTN",
    dataLimit: "5GB",
    dataUsed: "2.1GB",
    voiceMinutes: 500,
    voiceUsed: 180,
    validity: "15 days",
    cost: "$120/month",
    status: "Active",
    assignedTo: "Lisa Brown",
    phoneNumber: "+2348077777777",
    expiryDate: "2024-02-10",
    autoRenew: false,
  },
  {
    id: "BUN-005",
    name: "Basic Data Plan",
    type: "Data Only",
    provider: "9mobile",
    dataLimit: "5GB",
    dataUsed: "4.9GB",
    voiceMinutes: 0,
    voiceUsed: 0,
    validity: "30 days",
    cost: "$15/month",
    status: "Low Data",
    assignedTo: "Tom Davis",
    phoneNumber: "+2348066666666",
    expiryDate: "2024-02-18",
    autoRenew: true,
  },
]

export default function AirtimeBundlesPage() {
  const [addBundleModal, setAddBundleModal] = useState(false)
  const [bundles, setBundles] = useState<any[]>(airtimeBundles)
  const [selectedBundles, setSelectedBundles] = useState<string[]>([])

  const handleAddBundle = async (data: any) => {
    try {
      // In a real application, this would save to the database
      const newBundle = {
        id: `BUN-${String(bundles.length + 1).padStart(3, '0')}`,
        ...data,
        status: "Active",
        dataUsed: "0GB",
        voiceUsed: 0,
      }
      
      setBundles([...bundles, newBundle])
      toast.success(`Added ${data.name} bundle`)
      
      // Log the action
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created airtime bundle',
        'airtime_bundle',
        newBundle.id,
        `Created bundle: ${data.name} (${data.type})`
      )
    } catch (error) {
      console.error('Failed to add bundle:', error)
      toast.error('Failed to add bundle')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBundles(bundles.map(bundle => bundle.id))
    } else {
      setSelectedBundles([])
    }
  }

  const handleBulkDelete = () => {
    const bundlesToDelete = bundles.filter(bundle => selectedBundles.includes(bundle.id))
    setBundles(bundles.filter(bundle => !selectedBundles.includes(bundle.id)))
    setSelectedBundles([])
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted airtime bundles',
      'airtime_bundle',
      bundlesToDelete.length,
      `Deleted ${bundlesToDelete.length} bundles: ${bundlesToDelete.map(b => b.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const bundlesToExport = bundles.filter(bundle => selectedBundles.includes(bundle.id))
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported airtime bundles',
      'airtime_bundle',
      bundlesToExport.length,
      `Exported ${bundlesToExport.length} bundles: ${bundlesToExport.map(b => b.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedBundles = bundles.map(bundle => 
      selectedBundles.includes(bundle.id) 
        ? { ...bundle, status } 
        : bundle
    )
    setBundles(updatedBundles)
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated bundle status to ${status}`,
      'airtime_bundle',
      selectedBundles.length,
      `Updated ${selectedBundles.length} bundles status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const bundlesToEmail = bundles.filter(bundle => selectedBundles.includes(bundle.id))
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed airtime bundles',
      'airtime_bundle',
      bundlesToEmail.length,
      `Sent email about ${bundlesToEmail.length} bundles: ${bundlesToEmail.map(b => b.name).join(', ')}`
    )
  }

  const getDataUsagePercentage = (used: string, limit: string) => {
    if (limit === "Unlimited") return 0
    const usedGB = parseFloat(used.replace('GB', ''))
    const limitGB = parseFloat(limit.replace('GB', ''))
    return (usedGB / limitGB) * 100
  }

  const getVoiceUsagePercentage = (used: number, limit: number | string) => {
    if (limit === "Unlimited") return 0
    const limitNum = typeof limit === 'string' ? parseInt(limit) : limit
    return (used / limitNum) * 100
  }

  return (
    <SidebarInset>
      <Header 
        title="Airtime Bundle Management" 
        description="Manage mobile data plans, airtime allocations, and bundle subscriptions" 
      />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {bundleStats.map((stat) => (
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
          {/* Bundle Types Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Bundle Types</CardTitle>
              <CardDescription>Distribution of bundle types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bundleTypes.map((type) => (
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
              <CardDescription>Common bundle management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start bg-transparent" 
                variant="outline"
                onClick={() => setAddBundleModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Bundle
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Bulk Import
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Low Usage Alerts
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Usage Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bundle activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Bundle renewed</div>
                <div className="text-muted-foreground">Corporate Data Plan • 2h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">New bundle assigned</div>
                <div className="text-muted-foreground">Executive Voice+Data • 4h ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Usage alert</div>
                <div className="text-muted-foreground">Basic Data Plan • 1d ago</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Bundle expired</div>
                <div className="text-muted-foreground">International Roaming • 2d ago</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bundles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Airtime Bundles</CardTitle>
                <CardDescription>Manage mobile data plans and airtime allocations</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search bundles..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm" onClick={() => setAddBundleModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bundle
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedBundles}
                totalItems={bundles.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="bundles"
              />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bundle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Data Usage</TableHead>
                    <TableHead>Voice Usage</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bundles.map((bundle) => (
                    <TableRow key={bundle.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bundle.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {bundle.phoneNumber} • {bundle.cost}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{bundle.type}</Badge>
                      </TableCell>
                      <TableCell>{bundle.provider}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{bundle.dataUsed}</span>
                            <span className="text-muted-foreground">/ {bundle.dataLimit}</span>
                          </div>
                          <Progress 
                            value={getDataUsagePercentage(bundle.dataUsed, bundle.dataLimit)} 
                            className="h-1" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {bundle.voiceMinutes > 0 && (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>{bundle.voiceUsed}</span>
                              <span className="text-muted-foreground">/ {bundle.voiceMinutes}</span>
                            </div>
                            <Progress 
                              value={getVoiceUsagePercentage(bundle.voiceUsed, bundle.voiceMinutes)} 
                              className="h-1" 
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{bundle.assignedTo}</div>
                          <div className="text-sm text-muted-foreground">{bundle.phoneNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bundle.status === "Active"
                              ? "default"
                              : bundle.status === "Low Data"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {bundle.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{bundle.expiryDate}</div>
                          <div className="text-muted-foreground">
                            {bundle.autoRenew ? "Auto-renew" : "Manual"}
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
                            <DropdownMenuItem>Edit Bundle</DropdownMenuItem>
                            <DropdownMenuItem>Reassign User</DropdownMenuItem>
                            <DropdownMenuItem>Renew Bundle</DropdownMenuItem>
                            <DropdownMenuItem>Usage History</DropdownMenuItem>
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

      {/* Add Bundle Modal */}
      <AddBundleModal
        open={addBundleModal}
        onOpenChange={setAddBundleModal}
        onSubmit={handleAddBundle}
      />
    </SidebarInset>
  )
} 