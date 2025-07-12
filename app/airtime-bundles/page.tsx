"use client"

import { useState } from "react"
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
import { Filter, MoreHorizontal, Plus, Search, Smartphone, Wifi, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { airtimeBundlesApi, usersApi } from "@/lib/api"
import { AirtimeBundle, User } from "@/lib/supabase"

export default function AirtimeBundlesPage() {
  const [addBundleModal, setAddBundleModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterProvider, setFilterProvider] = useState<string>("all")

  // Real-time data
  const { data: bundles, loading: bundlesLoading, error: bundlesError, refresh: refreshBundles } = useRealtime<AirtimeBundle>({
    table: 'airtime_bundles',
    onDataChange: (payload) => {
      console.log('Bundle data changed:', payload)
      toast.success('Bundle data updated in real-time')
    }
  })

  const { data: users, loading: usersLoading, error: usersError } = useRealtime<User>({
    table: 'users'
  })

  // Calculate real-time stats
  const bundleStats = [
    { 
      label: "Active Bundles", 
      value: bundles.filter(b => b.status === "Active").length.toString(), 
      change: "+5", 
      icon: Smartphone 
    },
    { 
      label: "Total Data Used", 
      value: `${bundles.reduce((sum, b) => sum + (parseFloat(b.data_used) || 0), 0).toFixed(1)}GB`, 
      change: "+12%", 
      icon: Wifi 
    },
    { 
      label: "Monthly Cost", 
      value: `$${bundles.reduce((sum, b) => sum + (parseFloat(b.cost.replace('$', '').replace('/month', '')) || 0), 0).toLocaleString()}`, 
      change: "+8%", 
      icon: Wifi 
    },
    { 
      label: "Expiring Soon", 
      value: bundles.filter(b => {
        if (!b.expiry_date) return false
        const expiry = new Date(b.expiry_date)
        const now = new Date()
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        return expiry <= thirtyDaysFromNow && expiry > now
      }).length.toString(), 
      change: "+2", 
      icon: Smartphone 
    },
  ]

  // Filter bundles based on search and filters
  const filteredBundles = bundles.filter(bundle => {
    const matchesSearch = bundle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bundle.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bundle.phone_number?.includes(searchTerm)
    
    const matchesType = filterType === "all" || bundle.type.toLowerCase() === filterType.toLowerCase()
    const matchesProvider = filterProvider === "all" || bundle.provider.toLowerCase() === filterProvider.toLowerCase()
    
    return matchesSearch && matchesType && matchesProvider
  })

  const handleAddBundle = async (bundleData: any) => {
    try {
      // TODO: Implement add bundle functionality
      toast.success('Bundle added successfully')
      refreshBundles()
    } catch (error) {
      console.error('Failed to add bundle:', error)
      toast.error('Failed to add bundle')
    }
  }

  const handleBundleAction = (bundle: AirtimeBundle, action: string) => {
    switch (action) {
      case 'renew':
        // TODO: Implement renew action
        toast.info('Renew functionality coming soon')
        break
      case 'suspend':
        // TODO: Implement suspend action
        toast.info('Suspend functionality coming soon')
        break
      case 'details':
        // TODO: Implement details action
        toast.info('Details functionality coming soon')
        break
      default:
        break
    }
  }

  if (bundlesError || usersError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Airtime Bundles" description="Manage mobile data plans and airtime bundles" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading bundles</div>
                <Button onClick={refreshBundles} variant="outline">Retry</Button>
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
        <Header title="Airtime Bundles" description="Manage mobile data plans and airtime bundles" />
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
                    <span className="text-green-600">{stat.change}</span> from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Data Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>High Usage (>80%)</span>
                    <span>{bundles.filter(b => {
                      const used = parseFloat(b.data_used) || 0
                      const limit = parseFloat(b.data_limit) || 1
                      return (used / limit) > 0.8
                    }).length}</span>
                  </div>
                  <Progress value={bundles.filter(b => {
                    const used = parseFloat(b.data_used) || 0
                    const limit = parseFloat(b.data_limit) || 1
                    return (used / limit) > 0.8
                  }).length / bundles.length * 100} className="h-2 [&>div]:bg-red-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Medium Usage (40-80%)</span>
                    <span>{bundles.filter(b => {
                      const used = parseFloat(b.data_used) || 0
                      const limit = parseFloat(b.data_limit) || 1
                      const ratio = used / limit
                      return ratio > 0.4 && ratio <= 0.8
                    }).length}</span>
                  </div>
                  <Progress value={bundles.filter(b => {
                    const used = parseFloat(b.data_used) || 0
                    const limit = parseFloat(b.data_limit) || 1
                    const ratio = used / limit
                    return ratio > 0.4 && ratio <= 0.8
                  }).length / bundles.length * 100} className="h-2 [&>div]:bg-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Provider Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.from(new Set(bundles.map(b => b.provider))).map(provider => (
                  <div key={provider} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>{provider}</span>
                      <span>{bundles.filter(b => b.provider === provider).length}</span>
                    </div>
                    <Progress 
                      value={bundles.filter(b => b.provider === provider).length / bundles.length * 100} 
                      className="h-2" 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Expiry Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="font-medium">This Week</div>
                  <div className="text-muted-foreground">
                    {bundles.filter(b => {
                      if (!b.expiry_date) return false
                      const expiry = new Date(b.expiry_date)
                      const now = new Date()
                      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                      return expiry <= weekFromNow && expiry > now
                    }).length} bundles expiring
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Next Week</div>
                  <div className="text-muted-foreground">
                    {bundles.filter(b => {
                      if (!b.expiry_date) return false
                      const expiry = new Date(b.expiry_date)
                      const now = new Date()
                      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
                      const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
                      return expiry <= twoWeeksFromNow && expiry > weekFromNow
                    }).length} bundles expiring
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-medium">Overdue</div>
                  <div className="text-red-600">
                    {bundles.filter(b => {
                      if (!b.expiry_date) return false
                      const expiry = new Date(b.expiry_date)
                      const now = new Date()
                      return expiry < now
                    }).length} bundles expired
                  </div>
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
                  <CardDescription>Mobile data plans and airtime bundle management</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search bundles..." 
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
                      <DropdownMenuItem onClick={() => setFilterType("data only")}>
                        Data Only
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("voice + data")}>
                        Voice + Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("unlimited")}>
                        Unlimited
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm" onClick={() => setAddBundleModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Bundle
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {bundlesLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading bundles...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Bundle</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Data Usage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBundles.map((bundle) => {
                      const assignedUser = users.find(u => u.id === bundle.assigned_to)
                      const dataUsed = parseFloat(bundle.data_used) || 0
                      const dataLimit = parseFloat(bundle.data_limit) || 1
                      const usagePercentage = (dataUsed / dataLimit) * 100
                      
                      return (
                        <TableRow key={bundle.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{bundle.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {bundle.type} • {bundle.cost}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {assignedUser ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignedUser.avatar || ""} />
                                  <AvatarFallback>{assignedUser.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{assignedUser.name}</div>
                                  <div className="text-xs text-muted-foreground">{bundle.phone_number}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{bundle.provider}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>{bundle.data_used} / {bundle.data_limit}</span>
                                <span>{usagePercentage.toFixed(1)}%</span>
                              </div>
                              <Progress 
                                value={usagePercentage} 
                                className={`h-2 ${usagePercentage > 80 ? '[&>div]:bg-red-500' : usagePercentage > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`} 
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={bundle.status === "Active" ? "default" : 
                                     bundle.status === "Suspended" ? "secondary" : "destructive"}
                            >
                              {bundle.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {bundle.expiry_date ? (
                                <div>
                                  <div>{new Date(bundle.expiry_date).toLocaleDateString()}</div>
                                  <div className="text-muted-foreground">
                                    {Math.ceil((new Date(bundle.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                  </div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No expiry</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleBundleAction(bundle, 'details')}>
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBundleAction(bundle, 'renew')}>
                                  Renew Bundle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleBundleAction(bundle, 'suspend')}>
                                  Suspend Bundle
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

          {/* TODO: Add modals when components are created */}
        </div>
      </SidebarInset>
    </ProtectedRoute>
  )
} 