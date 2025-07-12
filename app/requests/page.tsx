"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { CheckCircle, Clock, Filter, MoreHorizontal, Plus, Search, Wrench, XCircle, DollarSign, Loader2 } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { requestsApi, usersApi } from "@/lib/api"
import { Request, User } from "@/lib/supabase"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export default function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Real-time data
  const { data: requests, loading: requestsLoading, error: requestsError, refresh: refreshRequests } = useRealtime<Request>({
    table: 'requests',
    onDataChange: (payload) => {
      console.log('Request data changed:', payload)
      toast.success('Request data updated in real-time')
    }
  })

  const { data: users, loading: usersLoading, error: usersError } = useRealtime<User>({
    table: 'users'
  })

  // Calculate real-time stats
  const requestStats = [
    { 
      label: "Open Requests", 
      value: requests.filter(r => r.status === "Pending").length.toString(), 
      change: "+15%", 
      icon: Clock 
    },
    { 
      label: "Approved Today", 
      value: requests.filter(r => {
        if (r.status !== "Approved") return false
        const approvedDate = new Date(r.approved_at || r.updated_at)
        const today = new Date()
        return approvedDate.toDateString() === today.toDateString()
      }).length.toString(), 
      change: "+25%", 
      icon: CheckCircle 
    },
    { 
      label: "Pending Budget", 
      value: `$${requests.filter(r => r.status === "Pending").reduce((sum, r) => sum + (r.budget || 0), 0).toLocaleString()}`, 
      change: "+8%", 
      icon: DollarSign 
    },
    { 
      label: "Avg Response Time", 
      value: "2.3h", 
      change: "-15%", 
      icon: Wrench 
    },
  ]

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.type.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filterType === "all" || request.type.toLowerCase() === filterType.toLowerCase()
    const matchesStatus = filterStatus === "all" || request.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate status distribution
  const statusDistribution = {
    pending: requests.filter(r => r.status === "Pending").length,
    approved: requests.filter(r => r.status === "Approved").length,
    fulfilled: requests.filter(r => r.status === "Fulfilled").length,
    rejected: requests.filter(r => r.status === "Rejected").length
  }

  const handleRequestAction = (request: Request, action: string) => {
    switch (action) {
      case 'approve':
        // TODO: Implement approve action
        toast.info('Approve functionality coming soon')
        break
      case 'reject':
        // TODO: Implement reject action
        toast.info('Reject functionality coming soon')
        break
      case 'fulfill':
        // TODO: Implement fulfill action
        toast.info('Fulfill functionality coming soon')
        break
      default:
        break
    }
  }

  if (requestsError || usersError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="IT Requests" description="Manage IT service requests, approvals, and fulfillment" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading requests</div>
                <Button onClick={refreshRequests} variant="outline">Retry</Button>
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
        <Header title="IT Requests" description="Manage IT service requests, approvals, and fulfillment" />
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {requestStats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Request Status Overview */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statusDistribution.pending}</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statusDistribution.approved}</div>
                <p className="text-xs text-muted-foreground">Ready for fulfillment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Fulfilled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{statusDistribution.fulfilled}</div>
                <p className="text-xs text-muted-foreground">Completed this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Rejected</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{statusDistribution.rejected}</div>
                <p className="text-xs text-muted-foreground">Not approved</p>
              </CardContent>
            </Card>
          </div>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Service Requests</CardTitle>
                  <CardDescription>IT service requests and approval workflow</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search requests..." 
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
                      <DropdownMenuItem onClick={() => setFilterType("hardware")}>
                        Hardware
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("software")}>
                        Software
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("access")}>
                        Access
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterType("support")}>
                        Support
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {requestsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading requests...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requester</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const requester = users.find(u => u.id === request.requester)
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{request.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {request.description.substring(0, 100)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.type}</Badge>
                          </TableCell>
                          <TableCell>
                            {requester ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={requester.avatar || ""} />
                                  <AvatarFallback>{requester.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="text-sm font-medium">{requester.name}</div>
                                  <div className="text-xs text-muted-foreground">{requester.department}</div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unknown</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={request.priority === "High" ? "destructive" : 
                                     request.priority === "Medium" ? "default" : "secondary"}
                            >
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={request.status === "Approved" ? "default" : 
                                     request.status === "Pending" ? "secondary" : 
                                     request.status === "Fulfilled" ? "outline" : "destructive"}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {request.budget ? `$${request.budget.toLocaleString()}` : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(request.created_at)}
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
                                <DropdownMenuItem onClick={() => handleRequestAction(request, 'approve')}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve Request
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRequestAction(request, 'reject')}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject Request
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRequestAction(request, 'fulfill')}>
                                  <Wrench className="h-4 w-4 mr-2" />
                                  Mark Fulfilled
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
      </SidebarInset>
    </ProtectedRoute>
  )
}
