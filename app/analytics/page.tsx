"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarInset } from "@/components/ui/sidebar"
import { BarChart3, TrendingUp, Users, Zap, Activity, Calendar, Clock, AlertTriangle } from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"

// Mock analytics data
const analyticsData = {
  incidents: {
    total: 156,
    resolved: 142,
    pending: 14,
    critical: 3,
    trend: [
      { month: 'Jan', count: 12 },
      { month: 'Feb', count: 18 },
      { month: 'Mar', count: 15 },
      { month: 'Apr', count: 22 },
      { month: 'May', count: 19 },
      { month: 'Jun', count: 25 },
    ]
  },
  devices: {
    total: 892,
    active: 756,
    maintenance: 89,
    retired: 47,
    trend: [
      { month: 'Jan', count: 820 },
      { month: 'Feb', count: 835 },
      { month: 'Mar', count: 845 },
      { month: 'Apr', count: 860 },
      { month: 'May', count: 875 },
      { month: 'Jun', count: 892 },
    ]
  },
  requests: {
    total: 234,
    approved: 198,
    pending: 28,
    rejected: 8,
    avgResponseTime: '2.3h'
  },
  performance: {
    uptime: 99.8,
    responseTime: 45,
    userSatisfaction: 4.6,
    costEfficiency: 87
  }
}

const recentActivities = [
  {
    id: 1,
    action: 'Incident Resolved',
    description: 'Network connectivity issue in Building A resolved',
    user: 'John Smith',
    time: '2 hours ago',
    type: 'incident'
  },
  {
    id: 2,
    action: 'Device Assigned',
    description: 'MacBook Pro assigned to Sarah Johnson',
    user: 'Mike Wilson',
    time: '4 hours ago',
    type: 'device'
  },
  {
    id: 3,
    action: 'Request Approved',
    description: 'Adobe Creative Suite license request approved',
    user: 'Laurian Lawrence',
    time: '6 hours ago',
    type: 'request'
  },
  {
    id: 4,
    action: 'Maintenance Scheduled',
    description: 'Server maintenance scheduled for Sunday 2AM',
    user: 'John Smith',
    time: '1 day ago',
    type: 'maintenance'
  },
  {
    id: 5,
    action: 'New User Added',
    description: 'Emily Davis added to Engineering department',
    user: 'Sarah Johnson',
    time: '1 day ago',
    type: 'user'
  }
]

export default function AnalyticsPage() {
  return (
    <ProtectedRoute>
    <SidebarInset>
      <Header title="Analytics & Reports" description="Comprehensive insights and analytics for IT operations" />
      <div className="flex-1 space-y-6 p-6">
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
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Activity className="h-4 w-4 text-blue-600" />
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
                ))}
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
