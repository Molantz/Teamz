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
import {
  AlertTriangle,
  Clock,
  Filter,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  TrendingDown,
  CheckCircle,
  Loader2,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { incidentsApi, usersApi } from "@/lib/api"
import { Incident, User } from "@/lib/supabase"

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Real-time data
  const { data: incidents, loading: incidentsLoading, error: incidentsError, refresh: refreshIncidents } = useRealtime<Incident>({
    table: 'incidents',
    onDataChange: (payload) => {
      console.log('Incident data changed:', payload)
      toast.success('Incident data updated in real-time')
    }
  })

  const { data: users, loading: usersLoading, error: usersError } = useRealtime<User>({
    table: 'users'
  })

  // Calculate real-time stats
  const incidentStats = [
    {
      label: "Open Incidents",
      value: incidents.filter(i => i.status === "New" || i.status === "In Progress").length.toString(),
      change: "-8%",
      trend: "down",
      icon: ShieldAlert,
      color: "text-red-600",
    },
    {
      label: "In Progress",
      value: incidents.filter(i => i.status === "In Progress").length.toString(),
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      label: "Resolved Today",
      value: incidents.filter(i => {
        if (i.status !== "Resolved") return false
        const resolvedDate = new Date(i.updated_at)
        const today = new Date()
        return resolvedDate.toDateString() === today.toDateString()
      }).length.toString(),
      change: "+25%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Avg Resolution Time",
      value: "4.2h",
      change: "-12%",
      trend: "down",
      icon: TrendingDown,
      color: "text-blue-600",
    },
  ]

  // Filter incidents based on search and filters
  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesPriority = filterPriority === "all" || incident.priority.toLowerCase() === filterPriority.toLowerCase()
    const matchesStatus = filterStatus === "all" || incident.status.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  // Calculate priority distribution
  const priorityDistribution = {
    high: incidents.filter(i => i.priority === "High").length,
    medium: incidents.filter(i => i.priority === "Medium").length,
    low: incidents.filter(i => i.priority === "Low").length,
    unassigned: incidents.filter(i => !i.assignee).length
  }

  const handleIncidentAction = (incident: Incident, action: string) => {
    switch (action) {
      case 'assign':
        // TODO: Implement assign action
        toast.info('Assign functionality coming soon')
        break
      case 'update':
        // TODO: Implement update action
        toast.info('Update functionality coming soon')
        break
      case 'resolve':
        // TODO: Implement resolve action
        toast.info('Resolve functionality coming soon')
        break
      default:
        break
    }
  }

  if (incidentsError || usersError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Incident Management" description="Track, manage, and resolve IT incidents and issues" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading incidents</div>
                <Button onClick={refreshIncidents} variant="outline">Retry</Button>
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
        <Header title="Incident Management" description="Track, manage, and resolve IT incidents and issues" />
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {incidentStats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.trend === "up" ? "text-green-600" : "text-red-600"}>{stat.change}</span> from
                    last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Priority Distribution */}
          <div className="grid gap-6 md:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{priorityDistribution.high}</div>
                <p className="text-xs text-muted-foreground">Requires immediate attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Medium Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{priorityDistribution.medium}</div>
                <p className="text-xs text-muted-foreground">Standard response time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Low Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{priorityDistribution.low}</div>
                <p className="text-xs text-muted-foreground">Can be scheduled</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Unassigned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{priorityDistribution.unassigned}</div>
                <p className="text-xs text-muted-foreground">Awaiting assignment</p>
              </CardContent>
            </Card>
          </div>

          {/* Incidents Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Incidents</CardTitle>
                  <CardDescription>Current incidents and their resolution status</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search incidents..." 
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
                      <DropdownMenuItem onClick={() => setFilterPriority("all")}>
                        All Priorities
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("high")}>
                        High Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("medium")}>
                        Medium Priority
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterPriority("low")}>
                        Low Priority
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Incident
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {incidentsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading incidents...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incident</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assignee</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredIncidents.map((incident) => {
                      const assignee = users.find(u => u.id === incident.assignee)
                      
                      return (
                        <TableRow key={incident.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{incident.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {incident.description.substring(0, 100)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{incident.category}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={incident.priority === "High" ? "destructive" : 
                                     incident.priority === "Medium" ? "default" : "secondary"}
                            >
                              {incident.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {assignee ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={assignee.avatar || ""} />
                                  <AvatarFallback>{assignee.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{assignee.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={incident.status === "Resolved" ? "default" : 
                                     incident.status === "In Progress" ? "secondary" : "outline"}
                            >
                              {incident.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {formatDate(incident.created_at)}
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
                                <DropdownMenuItem onClick={() => handleIncidentAction(incident, 'assign')}>
                                  Assign Incident
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleIncidentAction(incident, 'update')}>
                                  Update Status
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleIncidentAction(incident, 'resolve')}>
                                  Mark Resolved
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
