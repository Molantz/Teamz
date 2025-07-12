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
import { useState, useEffect } from "react"
import { usersApi, assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { User, Asset, Incident, Request } from "@/lib/supabase"
import { AddUserModal } from "@/components/modals/add-user-modal"
import { AddAssetModal } from "@/components/modals/add-asset-modal"
import { ReportIssueModal } from "@/components/modals/report-issue-modal"
import { NewRequestModal } from "@/components/modals/new-request-modal"
import { AssignDeviceModal } from "@/components/modals/assign-device-modal"
import { ViewReportsModal } from "@/components/modals/view-reports-modal"

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
  const [addUserModal, setAddUserModal] = useState(false)
  const [addAssetModal, setAddAssetModal] = useState(false)
  const [reportIssueModal, setReportIssueModal] = useState(false)
  const [newRequestModal, setNewRequestModal] = useState(false)
  const [assignDeviceModal, setAssignDeviceModal] = useState(false)
  const [viewReportsModal, setViewReportsModal] = useState(false)
  
  // Real-time data states
  const [users, setUsers] = useState<User[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real-time data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [usersData, assetsData, incidentsData, requestsData] = await Promise.all([
          usersApi.getAll(),
          assetsApi.getAll(),
          incidentsApi.getAll(),
          requestsApi.getAll()
        ])
        
        setUsers(usersData)
        setAssets(assetsData)
        setIncidents(incidentsData)
        setRequests(requestsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    
    // Set up real-time subscriptions (optional)
    // const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    // return () => clearInterval(interval)
  }, [])

  // Calculate real-time stats
  const dashboardStats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      change: "+12%", // You can calculate this from historical data
      trend: "up",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Devices",
      value: assets.filter(asset => asset.status === "Available" || asset.status === "Assigned").length.toString(),
      change: "+5%",
      trend: "up",
      icon: Laptop,
      color: "text-green-600",
    },
    {
      title: "Open Incidents",
      value: incidents.filter(incident => incident.status === "New" || incident.status === "In Progress").length.toString(),
      change: "-8%",
      trend: "down",
      icon: ShieldAlert,
      color: "text-red-600",
    },
    {
      title: "Pending Requests",
      value: requests.filter(request => request.status === "Pending").length.toString(),
      change: "+15%",
      trend: "up",
      icon: Wrench,
      color: "text-orange-600",
    },
  ]

  // Get recent incidents (last 5)
  const recentIncidents = incidents
    .filter(incident => incident.status !== "Resolved")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)
    .map(incident => ({
      id: incident.id,
      title: incident.title,
      status: incident.status,
      priority: incident.priority,
      assignee: incident.assignee || "Unassigned",
      created: getTimeAgo(incident.created_at),
    }))

  // Helper function to calculate time ago
  function getTimeAgo(dateString: string): string {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  // System health (you can connect to real monitoring data)
  const systemHealth = [
    { name: "Server CPU", value: 45, status: "good" },
    { name: "Memory Usage", value: 72, status: "warning" },
    { name: "Disk Space", value: 89, status: "critical" },
    { name: "Network Load", value: 34, status: "good" },
  ]

  const handleAddUser = (data: any) => {
    console.log("New user added:", data)
    // Refresh users data
    usersApi.getAll().then(setUsers)
  }

  const handleAddAsset = (data: any) => {
    console.log("New asset added:", data)
    // Refresh assets data
    assetsApi.getAll().then(setAssets)
  }

  const handleReportIssue = (data: any) => {
    console.log("Issue reported:", data)
    // Refresh incidents data
    incidentsApi.getAll().then(setIncidents)
  }

  const handleNewRequest = (data: any) => {
    console.log("New request created:", data)
    // Refresh requests data
    requestsApi.getAll().then(setRequests)
  }

  const handleAssignDevice = (data: any) => {
    console.log("Device assigned:", data)
    // Refresh assets data
    assetsApi.getAll().then(setAssets)
  }

  const handleViewReports = (data: any) => {
    console.log("Report generated:", data)
    // Handle report generation
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Dashboard" description="Overview of your IT infrastructure and operations" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading dashboard...</p>
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
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setAddUserModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Users className="h-8 w-8 mb-2 text-blue-600" />
                    <span className="text-sm font-medium">Add User</span>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setAddAssetModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Package className="h-8 w-8 mb-2 text-green-600" />
                    <span className="text-sm font-medium">New Asset</span>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setReportIssueModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <ShieldAlert className="h-8 w-8 mb-2 text-red-600" />
                    <span className="text-sm font-medium">Report Issue</span>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setNewRequestModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Wrench className="h-8 w-8 mb-2 text-orange-600" />
                    <span className="text-sm font-medium">New Request</span>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setAssignDeviceModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Laptop className="h-8 w-8 mb-2 text-purple-600" />
                    <span className="text-sm font-medium">Assign Device</span>
                  </CardContent>
                </Card>
                <Card 
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => setViewReportsModal(true)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <TrendingUp className="h-8 w-8 mb-2 text-indigo-600" />
                    <span className="text-sm font-medium">View Reports</span>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modals */}
        <AddUserModal
          open={addUserModal}
          onOpenChange={setAddUserModal}
          onSubmit={handleAddUser}
        />
        <AddAssetModal
          open={addAssetModal}
          onOpenChange={setAddAssetModal}
          onSubmit={handleAddAsset}
        />
        <ReportIssueModal
          open={reportIssueModal}
          onOpenChange={setReportIssueModal}
          onSubmit={handleReportIssue}
        />
        <NewRequestModal
          open={newRequestModal}
          onOpenChange={setNewRequestModal}
          onSubmit={handleNewRequest}
        />
        <AssignDeviceModal
          open={assignDeviceModal}
          onOpenChange={setAssignDeviceModal}
          onSubmit={handleAssignDevice}
        />
        <ViewReportsModal
          open={viewReportsModal}
          onOpenChange={setViewReportsModal}
          onSubmit={handleViewReports}
        />
      </SidebarInset>
    </ProtectedRoute>
  )
}
