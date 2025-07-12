'use client'

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle, XCircle, Info, Settings, Filter, Plus, Trash2, Edit, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Alert {
  id: string
  type: 'info' | 'success' | 'warning' | 'error' | 'critical'
  title: string
  message: string
  category: 'system' | 'security' | 'performance' | 'maintenance' | 'user' | 'device'
  severity: 'low' | 'medium' | 'high' | 'critical'
  source: string
  timestamp: Date
  acknowledged: boolean
  resolved: boolean
  assignedTo?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  metadata?: Record<string, any>
}

interface AlertRule {
  id: string
  name: string
  description: string
  enabled: boolean
  conditions: AlertCondition[]
  actions: AlertAction[]
  created_at: Date
  updated_at: Date
}

interface AlertCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex'
  value: string
}

interface AlertAction {
  type: 'notification' | 'email' | 'webhook' | 'escalation'
  config: Record<string, any>
}

interface AdvancedAlertsSystemProps {
  currentUser: any
  onAlertClick?: (alert: Alert) => void
}

export function AdvancedAlertsSystem({ currentUser, onAlertClick }: AdvancedAlertsSystemProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreateRuleOpen, setIsCreateRuleOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'critical',
        title: 'Server CPU Usage Critical',
        message: 'Server CPU usage has exceeded 95% for more than 10 minutes',
        category: 'performance',
        severity: 'critical',
        source: 'monitoring-system',
        timestamp: new Date(),
        acknowledged: false,
        resolved: false,
        priority: 'urgent',
        tags: ['server', 'cpu', 'performance'],
        metadata: { cpu_usage: 97, server_id: 'SRV-001' }
      },
      {
        id: '2',
        type: 'warning',
        title: 'Database Connection Pool Low',
        message: 'Database connection pool is running low on available connections',
        category: 'system',
        severity: 'high',
        source: 'database-monitor',
        timestamp: new Date(Date.now() - 300000),
        acknowledged: true,
        resolved: false,
        priority: 'high',
        tags: ['database', 'connections'],
        metadata: { pool_usage: 85, max_connections: 100 }
      },
      {
        id: '3',
        type: 'info',
        title: 'Scheduled Maintenance',
        message: 'System maintenance scheduled for tonight at 2:00 AM',
        category: 'maintenance',
        severity: 'low',
        source: 'maintenance-scheduler',
        timestamp: new Date(Date.now() - 600000),
        acknowledged: true,
        resolved: false,
        priority: 'medium',
        tags: ['maintenance', 'scheduled'],
        metadata: { maintenance_window: '02:00-04:00', affected_services: ['api', 'web'] }
      }
    ]

    const mockRules: AlertRule[] = [
      {
        id: '1',
        name: 'High CPU Usage Alert',
        description: 'Triggers when CPU usage exceeds 90% for more than 5 minutes',
        enabled: true,
        conditions: [
          { field: 'cpu_usage', operator: 'greater_than', value: '90' }
        ],
        actions: [
          { type: 'notification', config: { channel: 'slack', message: 'High CPU usage detected' } },
          { type: 'email', config: { recipients: ['admin@company.com'] } }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '2',
        name: 'Database Connection Alert',
        description: 'Triggers when database connection pool usage exceeds 80%',
        enabled: true,
        conditions: [
          { field: 'pool_usage', operator: 'greater_than', value: '80' }
        ],
        actions: [
          { type: 'notification', config: { channel: 'teams', message: 'Database connection pool running low' } }
        ],
        created_at: new Date(),
        updated_at: new Date()
      }
    ]

    setAlerts(mockAlerts)
    setAlertRules(mockRules)
  }, [])

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
    toast.success('Alert acknowledged')
  }

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ))
    toast.success('Alert resolved')
  }

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId))
    toast.success('Alert deleted')
  }

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredAlerts = alerts.filter(alert => {
    const matchesType = filterType === 'all' || alert.type === filterType
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'acknowledged' && alert.acknowledged) ||
      (filterStatus === 'resolved' && alert.resolved) ||
      (filterStatus === 'active' && !alert.acknowledged && !alert.resolved)
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesSeverity && matchesStatus && matchesSearch
  })

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length
  const criticalCount = alerts.filter(alert => alert.severity === 'critical').length

  return (
    <>
      {/* Alert Bell with Badge */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {(unacknowledgedCount > 0 || criticalCount > 0) && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {criticalCount > 0 ? criticalCount : unacknowledgedCount}
          </Badge>
        )}
      </Button>

      {/* Alerts Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Advanced Alerts System
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Critical</p>
                      <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600">Unacknowledged</p>
                      <p className="text-2xl font-bold text-yellow-600">{unacknowledgedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {alerts.filter(a => a.resolved).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">Active Rules</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {alertRules.filter(r => r.enabled).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search alerts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setIsCreateRuleOpen(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Rule
              </Button>
            </div>

            {/* Alerts List */}
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <Card 
                    key={alert.id} 
                    className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                      !alert.acknowledged ? 'border-l-4 border-l-red-500' : ''
                    }`}
                    onClick={() => {
                      setSelectedAlert(alert)
                      onAlertClick?.(alert)
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{alert.title}</h4>
                            <div className="flex items-center gap-2">
                              <Badge className={getSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {format(alert.timestamp, 'MMM dd, HH:mm')}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{alert.message}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {alert.category}
                              </Badge>
                              {alert.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              {!alert.acknowledged && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleAcknowledgeAlert(alert.id)
                                  }}
                                >
                                  Acknowledge
                                </Button>
                              )}
                              {!alert.resolved && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleResolveAlert(alert.id)
                                  }}
                                >
                                  Resolve
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteAlert(alert.id)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Details Dialog */}
      {selectedAlert && (
        <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getAlertIcon(selectedAlert.type)}
                Alert Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">{selectedAlert.title}</h3>
                <p className="text-sm text-gray-600">{selectedAlert.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Severity</Label>
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Badge variant="outline">{selectedAlert.category}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Source</Label>
                  <p className="text-sm">{selectedAlert.source}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Timestamp</Label>
                  <p className="text-sm">{format(selectedAlert.timestamp, 'PPP p')}</p>
                </div>
              </div>
              {selectedAlert.metadata && (
                <div>
                  <Label className="text-xs text-gray-500">Metadata</Label>
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(selectedAlert.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 