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
import { CheckCircle, Clock, Filter, MoreHorizontal, Plus, Search, Wrench, XCircle, DollarSign } from "lucide-react"

const requests = [
  {
    id: "REQ-001",
    title: "New MacBook Pro for Development Team",
    description: "Request for high-performance laptop for mobile app development",
    type: "Hardware",
    status: "Pending",
    priority: "High",
    requester: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
      department: "Engineering",
    },
    estimatedCost: "$2,500",
    created: "2024-01-15T10:30:00Z",
    justification: "Current laptop unable to handle iOS development workload",
  },
  {
    id: "REQ-002",
    title: "Adobe Creative Suite License",
    description: "Annual license renewal for design team",
    type: "Software",
    status: "Approved",
    priority: "Medium",
    requester: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      department: "Marketing",
    },
    estimatedCost: "$600",
    created: "2024-01-14T14:20:00Z",
    justification: "Required for ongoing marketing campaigns and brand materials",
  },
  {
    id: "REQ-003",
    title: "VPN Access for Remote Employee",
    description: "Secure access setup for new remote team member",
    type: "Access",
    status: "Fulfilled",
    priority: "High",
    requester: {
      name: "Mike Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
      department: "IT",
    },
    estimatedCost: "$0",
    created: "2024-01-13T09:15:00Z",
    justification: "New hire requires secure access to company resources",
  },
  {
    id: "REQ-004",
    title: "Printer Repair Service",
    description: "Maintenance for HP LaserJet in HR department",
    type: "Support",
    status: "Rejected",
    priority: "Low",
    requester: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
      department: "HR",
    },
    estimatedCost: "$150",
    created: "2024-01-12T16:45:00Z",
    justification: "Printer showing paper jam errors frequently",
  },
]

const requestStats = [
  { label: "Open Requests", value: "47", change: "+15%", icon: Clock },
  { label: "Approved Today", value: "8", change: "+25%", icon: CheckCircle },
  { label: "Pending Budget", value: "$12.5K", change: "+8%", icon: DollarSign },
  { label: "Avg Response Time", value: "2.3h", change: "-15%", icon: Wrench },
]

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Just now"
  if (diffInHours < 24) return `${diffInHours}h ago`
  return `${Math.floor(diffInHours / 24)}d ago`
}

export default function RequestsPage() {
  return (
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
              <div className="text-2xl font-bold text-yellow-600">23</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">18</div>
              <p className="text-xs text-muted-foreground">Ready for fulfillment</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Fulfilled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">156</div>
              <p className="text-xs text-muted-foreground">Completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">4</div>
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
                  <Input placeholder="Search requests..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{request.description}</div>
                        <div className="text-xs text-muted-foreground">{request.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={request.requester.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {request.requester.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{request.requester.name}</div>
                          <div className="text-xs text-muted-foreground">{request.requester.department}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          request.priority === "High"
                            ? "destructive"
                            : request.priority === "Medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {request.status === "Pending" && <Clock className="h-3 w-3 text-yellow-500" />}
                        {request.status === "Approved" && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {request.status === "Fulfilled" && <CheckCircle className="h-3 w-3 text-blue-500" />}
                        {request.status === "Rejected" && <XCircle className="h-3 w-3 text-red-500" />}
                        <Badge
                          variant={
                            request.status === "Fulfilled"
                              ? "default"
                              : request.status === "Approved"
                                ? "secondary"
                                : request.status === "Pending"
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{request.estimatedCost}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(request.created)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Request</DropdownMenuItem>
                          <DropdownMenuItem>Approve Request</DropdownMenuItem>
                          <DropdownMenuItem>Assign Technician</DropdownMenuItem>
                          <DropdownMenuItem>Add Comments</DropdownMenuItem>
                          <DropdownMenuItem>Generate Quote</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Reject Request</DropdownMenuItem>
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
