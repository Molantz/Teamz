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
import { Calendar, Clock, Filter, MoreHorizontal, Plus, Search, Settings, Wrench, Laptop, Network } from "lucide-react"

const activities = [
  {
    id: "ACT-001",
    title: "Server Maintenance - Database Backup",
    description: "Performed weekly database backup and system optimization",
    category: "Maintenance",
    employee: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    duration: "2.5 hours",
    status: "Completed",
    date: "2024-01-15",
    time: "09:00 - 11:30",
    linkedItems: ["Server-DB-01", "Backup-System"],
  },
  {
    id: "ACT-002",
    title: "Network Configuration Update",
    description: "Updated firewall rules and network security policies",
    category: "Setup",
    employee: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    duration: "1.5 hours",
    status: "Completed",
    date: "2024-01-15",
    time: "14:00 - 15:30",
    linkedItems: ["Firewall-Main", "Network-Config"],
  },
  {
    id: "ACT-003",
    title: "User Support - Email Setup",
    description: "Configured email client for new employee onboarding",
    category: "Support",
    employee: {
      name: "Mike Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    duration: "0.5 hours",
    status: "Completed",
    date: "2024-01-15",
    time: "10:30 - 11:00",
    linkedItems: ["User-NewHire-001"],
  },
  {
    id: "ACT-004",
    title: "Hardware Installation - New Workstation",
    description: "Set up and configured new workstation for marketing team",
    category: "Installation",
    employee: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    duration: "3.0 hours",
    status: "In Progress",
    date: "2024-01-15",
    time: "13:00 - 16:00",
    linkedItems: ["Workstation-MKT-05", "Software-Office365"],
  },
]

const activityStats = [
  { label: "Today's Activities", value: "12", change: "+3" },
  { label: "This Week", value: "47", change: "+8" },
  { label: "Avg Daily Hours", value: "6.2", change: "+0.5" },
  { label: "Pending Approval", value: "3", change: "-1" },
]

const categoryIcons = {
  Maintenance: Wrench,
  Setup: Settings,
  Support: Calendar,
  Installation: Laptop,
  Network: Network,
}

export default function ActivitiesPage() {
  return (
    <SidebarInset>
      <Header title="Daily Activities" description="Track and manage daily IT tasks and activities" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {activityStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from yesterday
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Activities Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Activities Log</CardTitle>
                <CardDescription>Track time spent on IT tasks and projects</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search activities..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => {
                  const CategoryIcon = categoryIcons[activity.category as keyof typeof categoryIcons] || Calendar
                  return (
                    <TableRow key={activity.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <CategoryIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium">{activity.title}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">{activity.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{activity.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={activity.employee.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">
                              {activity.employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{activity.employee.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{activity.duration}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={activity.status === "Completed" ? "default" : "secondary"}>
                          {activity.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <div>{activity.date}</div>
                        <div className="text-xs">{activity.time}</div>
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
                            <DropdownMenuItem>Edit Activity</DropdownMenuItem>
                            <DropdownMenuItem>Add Time</DropdownMenuItem>
                            <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                            <DropdownMenuItem>Generate Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
