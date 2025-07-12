'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Activity, Users, Laptop, ShieldAlert, Clock, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRealtime } from '@/hooks/use-realtime'
import type { User, InventoryItem, Incident, Request } from '@/lib/types'
import { Label } from '@/components/ui/label'

interface DashboardMetric {
  label: string
  value: string | number
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: any
  color: string
  description?: string
}

interface SystemStatus {
  id: string
  name: string
  status: 'online' | 'offline' | 'warning' | 'maintenance'
  uptime: number
  responseTime: number
  lastCheck: Date
}

interface RealTimeDashboardPanelProps {
  currentUser: any
}

export function RealTimeDashboardPanel({ currentUser }: RealTimeDashboardPanelProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<DashboardMetric | null>(null)
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([])

  // Real-time data hooks
  const { data: users, loading: usersLoading } = useRealtime<User>({
    table: 'users'
  })

  const { data: assets, loading: assetsLoading } = useRealtime<InventoryItem>({
    table: 'assets'
  })

  const { data: incidents, loading: incidentsLoading } = useRealtime<Incident>({
    table: 'incidents'
  })

  const { data: requests, loading: requestsLoading } = useRealtime<Request>({
    table: 'requests'
  })

  // Mock system statuses
  useEffect(() => {
    const mockSystems: SystemStatus[] = [
      {
        id: '1',
        name: 'Main Database',
        status: 'online',
        uptime: 99.8,
        responseTime: 45,
        lastCheck: new Date()
      },
      {
        id: '2',
        name: 'API Gateway',
        status: 'online',
        uptime: 99.9,
        responseTime: 12,
        lastCheck: new Date()
      },
      {
        id: '3',
        name: 'File Storage',
        status: 'warning',
        uptime: 95.2,
        responseTime: 180,
        lastCheck: new Date()
      },
      {
        id: '4',
        name: 'Email Service',
        status: 'online',
        uptime: 99.7,
        responseTime: 28,
        lastCheck: new Date()
      }
    ]
    setSystemStatuses(mockSystems)
  }, [])

  // Calculate real-time metrics
  const dashboardMetrics: DashboardMetric[] = [
    {
      label: "Active Users",
      value: users.filter(u => u.status === 'Active').length,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      description: "Users currently active in the system"
    },
    {
      label: "Total Devices",
      value: assets.length,
      change: "+5%",
      trend: "up",
      icon: Laptop,
      color: "text-green-600",
      description: "Devices registered in the system"
    },
    {
      label: "Open Incidents",
      value: incidents.filter(i => i.status === "New" || i.status === "In Progress").length,
      change: "-8%",
      trend: "down",
      icon: ShieldAlert,
      color: "text-red-600",
      description: "Incidents requiring attention"
    },
    {
      label: "Pending Requests",
      value: requests.filter(r => r.status === "Pending").length,
      change: "+15%",
      trend: "up",
      icon: Clock,
      color: "text-yellow-600",
      description: "Requests awaiting approval"
    },
    {
      label: "System Uptime",
      value: "99.8%",
      change: "+0.2%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600",
      description: "Overall system availability"
    },
    {
      label: "Avg Response Time",
      value: "2.3s",
      change: "-12%",
      trend: "down",
      icon: Activity,
      color: "text-blue-600",
      description: "Average system response time"
    }
  ]

  const getStatusColor = (status: SystemStatus['status']) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'offline':
        return 'bg-red-100 text-red-800'
      case 'maintenance':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const handleMetricClick = (metric: DashboardMetric) => {
    setSelectedMetric(metric)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <div className="space-y-6">
        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardMetrics.map((metric, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleMetricClick(metric)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <div className={`p-2 rounded-full ${metric.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {getTrendIcon(metric.trend)}
                  <span className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {metric.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Status and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatuses.map((system) => (
                  <div key={system.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        system.status === 'online' ? 'bg-green-500' :
                        system.status === 'warning' ? 'bg-yellow-500' :
                        system.status === 'offline' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <div>
                        <p className="font-medium">{system.name}</p>
                        <p className="text-sm text-gray-600">
                          Uptime: {system.uptime}% • Response: {system.responseTime}ms
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(system.status)}>
                      {system.status}
                    </Badge>
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
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-gray-600">67%</span>
                  </div>
                  <Progress value={67} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-gray-600">82%</span>
                  </div>
                  <Progress value={82} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Disk Usage</span>
                    <span className="text-sm text-gray-600">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Network I/O</span>
                    <span className="text-sm text-gray-600">23%</span>
                  </div>
                  <Progress value={23} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Real-time Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'User login', user: 'John Doe', time: '2 minutes ago', type: 'info' },
                { action: 'Device assigned', user: 'Sarah Johnson', time: '5 minutes ago', type: 'success' },
                { action: 'Incident reported', user: 'Mike Wilson', time: '8 minutes ago', type: 'warning' },
                { action: 'Request approved', user: 'Lisa Brown', time: '12 minutes ago', type: 'success' },
                { action: 'System backup', user: 'System', time: '15 minutes ago', type: 'info' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-600">by {activity.user}</p>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metric Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedMetric?.icon && <selectedMetric.icon className="h-5 w-5" />}
              {selectedMetric?.label} Details
            </DialogTitle>
          </DialogHeader>
          {selectedMetric && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{selectedMetric.label}</h3>
                <p className="text-sm text-gray-600">{selectedMetric.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Current Value</Label>
                  <p className="text-2xl font-bold">{selectedMetric.value}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Change</Label>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(selectedMetric.trend)}
                    <span className="text-sm">{selectedMetric.change}</span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Historical Data</h4>
                <p className="text-sm text-gray-600">
                  Detailed historical data and trends for {selectedMetric.label.toLowerCase()} would be displayed here.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
} 