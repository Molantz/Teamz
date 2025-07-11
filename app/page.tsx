"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Laptop,
  Package,
  ShieldAlert,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react"
import { SidebarInset } from "@/components/ui/sidebar"
import { ProtectedRoute } from '@/components/protected-route'

const dashboardStats = [
  {
    title: "Total Users",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Devices",
    value: "892",
    change: "+5%",
    trend: "up",
    icon: Laptop,
    color: "text-green-600",
  },
  {
    title: "Open Incidents",
    value: "23",
    change: "-8%",
    trend: "down",
    icon: ShieldAlert,
    color: "text-red-600",
  },
  {
    title: "Pending Requests",
    value: "47",
    change: "+15%",
    trend: "up",
    icon: Wrench,
    color: "text-orange-600",
  },
]

const recentIncidents = [
  {
    id: "INC-001",
    title: "Network connectivity issues in Building A",
    status: "In Progress",
    priority: "High",
    assignee: "John Smith",
    created: "2 hours ago",
  },
  {
    id: "INC-002",
    title: "Printer not responding in HR department",
    status: "New",
    priority: "Medium",
    assignee: "Unassigned",
    created: "4 hours ago",
  },
  {
    id: "INC-003",
    title: "Email server slow response",
    status: "Resolved",
    priority: "Low",
    assignee: "Sarah Johnson",
    created: "1 day ago",
  },
]

const systemHealth = [
  { name: "Server CPU", value: 45, status: "good" },
  { name: "Memory Usage", value: 72, status: "warning" },
  { name: "Disk Space", value: 89, status: "critical" },
  { name: "Network Load", value: 34, status: "good" },
]

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <SidebarInset>
        <Header title="Dashboard" description="Overview of your IT infrastructure and operations" />
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
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

          <div className="grid gap-6 md:grid-cols-2">
            {/* Recent Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  Recent Incidents
                </CardTitle>
                <CardDescription>Latest incidents requiring attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-start space-x-4 rounded-lg border p-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">{incident.title}</p>
                        <Badge
                          variant={
                            incident.priority === "High"
                              ? "destructive"
                              : incident.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {incident.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{incident.id}</span>
                        <span>•</span>
                        <span>{incident.assignee}</span>
                        <span>•</span>
                        <span>{incident.created}</span>
                      </div>
                    </div>
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
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  System Health
                </CardTitle>
                <CardDescription>Real-time infrastructure monitoring</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemHealth.map((system) => (
                  <div key={system.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{system.name}</span>
                      <div className="flex items-center gap-2">
                        <span>{system.value}%</span>
                        {system.status === "critical" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {system.status === "warning" && <Clock className="h-4 w-4 text-yellow-500" />}
                        {system.status === "good" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </div>
                    </div>
                    <Progress
                      value={system.value}
                      className={`h-2 ${
                        system.status === "critical"
                          ? "[&>div]:bg-red-500"
                          : system.status === "warning"
                            ? "[&>div]:bg-yellow-500"
                            : "[&>div]:bg-green-500"
                      }`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Users className="h-8 w-8 mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Add User</span>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Package className="h-8 w-8 mb-2 text-green-600" />
                    <span className="text-sm font-medium">New Asset</span>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <ShieldAlert className="h-8 w-8 mb-2 text-red-600" />
                    <span className="text-sm font-medium">Report Issue</span>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Wrench className="h-8 w-8 mb-2 text-orange-600" />
                    <span className="text-sm font-medium">New Request</span>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Laptop className="h-8 w-8 mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Assign Device</span>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <TrendingUp className="h-8 w-8 mb-2 text-indigo-600" />
                    <span className="text-sm font-medium">View Reports</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </ProtectedRoute>
  )
}
