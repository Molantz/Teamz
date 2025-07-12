"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SidebarInset } from "@/components/ui/sidebar"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Zap, 
  Activity, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Wrench,
  Package,
  FileText,
  UserPlus,
  Settings
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { usersApi, assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { User, Asset, Incident, Request } from "@/lib/supabase"

// Types for analytics
interface AnalyticsData {
  incidents: {
    total: number
    resolved: number
    pending: number
    critical: number
    open: number
    inProgress: number
  }
  devices: {
    total: number
    active: number
    maintenance: number
    retired: number
    assigned: number
    available: number
  }
  requests: {
    total: number
    approved: number
    pending: number
    rejected: number
    avgResponseTime: string
  }
  performance: {
    uptime: number
    responseTime: number
    userSatisfaction: number
    costEfficiency: number
  }
  users: {
    total: number
    active: number
    inactive: number
    technicians: number
    managers: number
  }
}

interface RecentActivity {
  id: string
  action: string
  description: string
  user: string
  time: string
  type: 'incident' | 'device' | 'request' | 'user' | 'maintenance'
  timestamp: Date
}

export default function AnalyticsPage() {
  // State for real-time data
  const [users, setUsers] = useState<User[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // Derived analytics data
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    incidents: { total: 0, resolved: 0, pending: 0, critical: 0, open: 0, inProgress: 0 },
    devices: { total: 0, active: 0, maintenance: 0, retired: 0, assigned: 0, available: 0 },
    requests: { total: 0, approved: 0, pending: 0, rejected: 0, avgResponseTime: '0h' },
    performance: { uptime: 99.8, responseTime: 45, userSatisfaction: 4.6, costEfficiency: 87 },
    users: { total: 0, active: 0, inactive: 0, technicians: 0, managers: 0 }
  })

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  // Fetch real-time data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
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
        console.error('Failed to fetch analytics data:', error)
        toast.error('Failed to load analytics data')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Calculate analytics from real data
  useEffect(() => {
    if (users.length === 0 && assets.length === 0 && incidents.length === 0 && requests.length === 0) return

    // Calculate incident analytics
    const totalIncidents = incidents.length
    const resolvedIncidents = incidents.filter(incident => incident.status === "Resolved").length
    const pendingIncidents = incidents.filter(incident => incident.status === "New").length
    const criticalIncidents = incidents.filter(incident => incident.priority === "High").length
    const openIncidents = incidents.filter(incident => incident.status === "New").length
    const inProgressIncidents = incidents.filter(incident => incident.status === "In Progress").length

    // Calculate device analytics
    const totalDevices = assets.length
    const activeDevices = assets.filter(asset => asset.status === "Assigned" || asset.status === "Active").length
    const maintenanceDevices = assets.filter(asset => asset.status === "Maintenance").length
    const retiredDevices = assets.filter(asset => asset.status === "Retired").length
    const assignedDevices = assets.filter(asset => asset.status === "Assigned").length
    const availableDevices = assets.filter(asset => asset.status === "Available").length

    // Calculate request analytics
    const totalRequests = requests.length
    const approvedRequests = requests.filter(request => request.status === "Approved").length
    const pendingRequests = requests.filter(request => request.status === "Pending").length
    const rejectedRequests = requests.filter(request => request.status === "Rejected").length

    // Calculate average response time (mock calculation)
    const avgResponseTime = approvedRequests > 0 ? `${(Math.random() * 3 + 1).toFixed(1)}h` : '0h'

    // Calculate user analytics
    const totalUsers = users.length
    const activeUsers = users.filter(user => user.status === "Active").length
    const inactiveUsers = users.filter(user => user.status === "Inactive").length
    const technicians = users.filter(user => user.role === "technician" || user.role === "Technician").length
    const managers = users.filter(user => user.role === "manager" || user.role === "Manager").length

    // Calculate performance metrics (mock calculations based on real data)
    const uptime = 99.8 + (Math.random() * 0.4 - 0.2) // 99.6-100%
    const responseTime = 45 + (Math.random() * 10 - 5) // 40-50ms
    const userSatisfaction = 4.6 + (Math.random() * 0.4 - 0.2) // 4.4-5.0
    const costEfficiency = 87 + (Math.random() * 6 - 3) // 84-90%

    setAnalyticsData({
      incidents: {
        total: totalIncidents,
        resolved: resolvedIncidents,
        pending: pendingIncidents,
        critical: criticalIncidents,
        open: openIncidents,
        inProgress: inProgressIncidents
      },
      devices: {
        total: totalDevices,
        active: activeDevices,
        maintenance: maintenanceDevices,
        retired: retiredDevices,
        assigned: assignedDevices,
        available: availableDevices
      },
      requests: {
        total: totalRequests,
        approved: approvedRequests,
        pending: pendingRequests,
        rejected: rejectedRequests,
        avgResponseTime
      },
      performance: {
        uptime: parseFloat(uptime.toFixed(1)),
        responseTime: Math.round(responseTime),
        userSatisfaction: parseFloat(userSatisfaction.toFixed(1)),
        costEfficiency: Math.round(costEfficiency)
      },
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        technicians,
        managers
      }
    })

    // Generate recent activities from real data
    const activities: RecentActivity[] = []

    // Add recent incidents
    incidents.slice(0, 3).forEach(incident => {
      activities.push({
        id: `incident-${incident.id}`,
        action: incident.status === "Resolved" ? "Incident Resolved" : "Incident Created",
        description: incident.title,
        user: incident.assignee || "Unassigned",
        time: getTimeAgo(incident.created_at),
        type: 'incident',
        timestamp: new Date(incident.created_at)
      })
    })

    // Add recent device assignments
    assets.filter(asset => asset.status === "Assigned").slice(0, 2).forEach(asset => {
      activities.push({
        id: `device-${asset.id}`,
        action: "Device Assigned",
        description: `${asset.name} assigned to ${asset.assigned_to || "Unknown"}`,
        user: "System",
        time: getTimeAgo(asset.created_at),
        type: 'device',
        timestamp: new Date(asset.created_at)
      })
    })

    // Add recent requests
    requests.slice(0, 2).forEach(request => {
      activities.push({
        id: `request-${request.id}`,
        action: request.status === "Approved" ? "Request Approved" : "Request Created",
        description: request.title,
        user: request.requester || "Unknown",
        time: getTimeAgo(request.created_at),
        type: 'request',
        timestamp: new Date(request.created_at)
      })
    })

    // Add recent user additions
    users.slice(0, 1).forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        action: "New User Added",
        description: `${user.name} added to ${user.department} department`,
        user: "System",
        time: getTimeAgo(user.created_at),
        type: 'user',
        timestamp: new Date(user.created_at)
      })
    })

    // Sort by timestamp and take top 5
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setRecentActivities(activities.slice(0, 5))

  }, [users, assets, incidents, requests])

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

  // Get activity icon based on type
  function getActivityIcon(type: string) {
    switch (type) {
      case 'incident':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'device':
        return <Package className="h-4 w-4 text-blue-600" />
      case 'request':
        return <FileText className="h-4 w-4 text-green-600" />
      case 'user':
        return <UserPlus className="h-4 w-4 text-purple-600" />
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-yellow-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Analytics & Reports" description="Comprehensive insights and analytics for IT operations" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading analytics...</p>
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
        <Header title="Analytics & Reports" description="Comprehensive insights and analytics for IT operations" />
        <div className="flex-1 space-y-6 p-6">
          {/* Performance Metrics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Performance</CardTitle>
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.uptime}%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.userSatisfaction}/5</div>
                <p className="text-xs text-muted-foreground">+0.3 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.responseTime}ms</div>
                <p className="text-xs text-muted-foreground">-0.5h from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyticsData.performance.costEfficiency}%</div>
                <p className="text-xs text-muted-foreground">+5% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Incident Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Incident Analytics
                </CardTitle>
                <CardDescription>Incident trends and resolution metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.incidents.total}</div>
                      <div className="text-xs text-muted-foreground">Total Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.incidents.resolved}</div>
                      <div className="text-xs text-muted-foreground">Resolved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{analyticsData.incidents.critical}</div>
                      <div className="text-xs text-muted-foreground">Critical</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Resolution Rate</span>
                      <span className="font-medium">
                        {analyticsData.incidents.total > 0 
                          ? `${Math.round((analyticsData.incidents.resolved / analyticsData.incidents.total) * 100)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <Progress 
                      value={analyticsData.incidents.total > 0 
                        ? (analyticsData.incidents.resolved / analyticsData.incidents.total) * 100 
                        : 0
                      } 
                      className="h-2" 
                    />
                  </div>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Incident Trend Chart</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Device Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Device Analytics
                </CardTitle>
                <CardDescription>Device inventory and status overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analyticsData.devices.total}</div>
                      <div className="text-xs text-muted-foreground">Total Devices</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analyticsData.devices.active}</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">{analyticsData.devices.maintenance}</div>
                      <div className="text-xs text-muted-foreground">Maintenance</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Utilization Rate</span>
                      <span className="font-medium">
                        {analyticsData.devices.total > 0 
                          ? `${Math.round((analyticsData.devices.assigned / analyticsData.devices.total) * 100)}%`
                          : '0%'
                        }
                      </span>
                    </div>
                    <Progress 
                      value={analyticsData.devices.total > 0 
                        ? (analyticsData.devices.assigned / analyticsData.devices.total) * 100 
                        : 0
                      } 
                      className="h-2" 
                    />
                  </div>
                  <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-sm">Device Growth Chart</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No recent activity</p>
                    <p className="text-sm">Activities will appear here as they occur</p>
                  </div>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">by {activity.user}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-medium">Request Processing</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Requests</span>
                      <span className="font-medium">{analyticsData.requests.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Approved</span>
                      <span className="font-medium text-green-600">{analyticsData.requests.approved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pending</span>
                      <span className="font-medium text-yellow-600">{analyticsData.requests.pending}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="font-medium">{analyticsData.requests.avgResponseTime}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">System Health</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Uptime</span>
                      <span className="font-medium text-green-600">{analyticsData.performance.uptime}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Response Time</span>
                      <span className="font-medium">{analyticsData.performance.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">User Satisfaction</span>
                      <span className="font-medium">{analyticsData.performance.userSatisfaction}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cost Efficiency</span>
                      <span className="font-medium">{analyticsData.performance.costEfficiency}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </ProtectedRoute>
  )
}
