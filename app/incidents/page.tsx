"use client"

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
} from "lucide-react"

const incidents = [
  {
    id: "INC-001",
    title: "Network connectivity issues in Building A",
    description: "Multiple users reporting intermittent network connectivity",
    status: "In Progress",
    priority: "High",
    category: "Network",
    assignee: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reporter: "Sarah Johnson",
    created: "2024-01-15T10:30:00Z",
    updated: "2024-01-15T14:20:00Z",
    affectedUsers: 25,
  },
  {
    id: "INC-002",
    title: "Email server slow response",
    description: "Email delivery delays and slow server response times",
    status: "New",
    priority: "Medium",
    category: "Email",
    assignee: null,
    reporter: "Mike Wilson",
    created: "2024-01-15T09:15:00Z",
    updated: "2024-01-15T09:15:00Z",
    affectedUsers: 50,
  },
  {
    id: "INC-003",
    title: "Printer not responding in HR department",
    description: "HP LaserJet printer showing offline status",
    status: "Resolved",
    priority: "Low",
    category: "Hardware",
    assignee: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reporter: "Lisa Brown",
    created: "2024-01-14T16:45:00Z",
    updated: "2024-01-15T08:30:00Z",
    affectedUsers: 5,
  },
  {
    id: "INC-004",
    title: "VPN connection failures",
    description: "Remote users unable to connect to company VPN",
    status: "In Progress",
    priority: "High",
    category: "Security",
    assignee: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    reporter: "David Chen",
    created: "2024-01-15T11:20:00Z",
    updated: "2024-01-15T13:45:00Z",
    affectedUsers: 15,
  },
]

const incidentStats = [
  {
    label: "Open Incidents",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: ShieldAlert,
    color: "text-red-600",
  },
  {
    label: "In Progress",
    value: "12",
    change: "+15%",
    trend: "up",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    label: "Resolved Today",
    value: "8",
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

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export default function IncidentsPage() {
  return (
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
              <div className="text-2xl font-bold text-red-600">7</div>
              <p className="text-xs text-muted-foreground">Requires immediate attention</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Medium Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-muted-foreground">Standard response time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Low Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">4</div>
              <p className="text-xs text-muted-foreground">Can be scheduled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Unassigned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">3</div>
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
                <CardDescription>Current incidents requiring attention</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search incidents..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Incident
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Affected Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{incident.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {incident.id} • {incident.category}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1">{incident.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          incident.priority === "High"
                            ? "destructive"
                            : incident.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {incident.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          incident.status === "Resolved"
                            ? "default"
                            : incident.status === "In Progress"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {incident.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={incident.assignee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {incident.assignee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{incident.assignee.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-sm">{incident.affectedUsers}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(incident.created)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Incident</DropdownMenuItem>
                          <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                          <DropdownMenuItem>Add Comment</DropdownMenuItem>
                          <DropdownMenuItem>Change Priority</DropdownMenuItem>
                          <DropdownMenuItem>Escalate</DropdownMenuItem>
                          <DropdownMenuItem className="text-green-600">Mark Resolved</DropdownMenuItem>
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
