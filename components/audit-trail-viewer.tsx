'use client'

import { useState, useEffect } from 'react'
import { History, User, Clock, Eye, Download, Filter, Search, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface AuditLog {
  id: string
  timestamp: Date
  user_id: string
  user_name: string
  action: string
  resource_type: string
  resource_id: string
  resource_name: string
  details: string
  ip_address: string
  user_agent: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'user_action' | 'system_event' | 'security_event' | 'data_change' | 'access_control'
  metadata?: Record<string, any>
}

interface AuditTrailViewerProps {
  resourceType?: string
  resourceId?: string
  onLogClick?: (log: AuditLog) => void
}

export function AuditTrailViewer({ resourceType, resourceId, onLogClick }: AuditTrailViewerProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [filterUser, setFilterUser] = useState<string>('all')
  const [filterAction, setFilterAction] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()

  // Mock audit logs
  useEffect(() => {
    const mockLogs: AuditLog[] = [
      {
        id: '1',
        timestamp: new Date(),
        user_id: 'user1',
        user_name: 'John Doe',
        action: 'CREATE',
        resource_type: 'user',
        resource_id: 'user123',
        resource_name: 'Jane Smith',
        details: 'Created new user account for Jane Smith',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        category: 'user_action',
        metadata: {
          department: 'HR',
          role: 'Manager',
          email: 'jane.smith@company.com'
        }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000),
        user_id: 'user2',
        user_name: 'Sarah Johnson',
        action: 'UPDATE',
        resource_type: 'device',
        resource_id: 'device456',
        resource_name: 'MacBook Pro - Sarah',
        details: 'Updated device assignment and status',
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        severity: 'low',
        category: 'data_change',
        metadata: {
          previous_status: 'Available',
          new_status: 'Assigned',
          assigned_to: 'Sarah Johnson'
        }
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000),
        user_id: 'system',
        user_name: 'System',
        action: 'SECURITY_ALERT',
        resource_type: 'system',
        resource_id: 'security001',
        resource_name: 'Failed Login Attempt',
        details: 'Multiple failed login attempts detected for user account',
        ip_address: '203.0.113.45',
        user_agent: 'Unknown',
        severity: 'high',
        category: 'security_event',
        metadata: {
          failed_attempts: 5,
          blocked_ip: true,
          account_locked: true
        }
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 900000),
        user_id: 'user3',
        user_name: 'Mike Wilson',
        action: 'DELETE',
        resource_type: 'incident',
        resource_id: 'incident789',
        resource_name: 'Network Connectivity Issue',
        details: 'Deleted resolved incident ticket',
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'medium',
        category: 'user_action',
        metadata: {
          resolution_time: '2 hours',
          resolution_method: 'Router restart'
        }
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 1200000),
        user_id: 'user1',
        user_name: 'John Doe',
        action: 'EXPORT',
        resource_type: 'report',
        resource_id: 'report001',
        resource_name: 'User Activity Report',
        details: 'Exported user activity report for Q1 2024',
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        severity: 'low',
        category: 'user_action',
        metadata: {
          report_format: 'PDF',
          date_range: 'Q1 2024',
          record_count: 1250
        }
      }
    ]

    setAuditLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = auditLogs

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply user filter
    if (filterUser !== 'all') {
      filtered = filtered.filter(log => log.user_id === filterUser)
    }

    // Apply action filter
    if (filterAction !== 'all') {
      filtered = filtered.filter(log => log.action === filterAction)
    }

    // Apply severity filter
    if (filterSeverity !== 'all') {
      filtered = filtered.filter(log => log.severity === filterSeverity)
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(log => log.category === filterCategory)
    }

    // Apply date filters
    if (dateFrom) {
      filtered = filtered.filter(log => log.timestamp >= dateFrom)
    }
    if (dateTo) {
      filtered = filtered.filter(log => log.timestamp <= dateTo)
    }

    setFilteredLogs(filtered)
  }, [auditLogs, searchTerm, filterUser, filterAction, filterSeverity, filterCategory, dateFrom, dateTo])

  const getSeverityColor = (severity: AuditLog['severity']) => {
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

  const getCategoryIcon = (category: AuditLog['category']) => {
    switch (category) {
      case 'security_event':
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'user_action':
        return <User className="h-4 w-4 text-blue-500" />
      case 'system_event':
        return <Info className="h-4 w-4 text-gray-500" />
      case 'data_change':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'access_control':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const handleLogClick = (log: AuditLog) => {
    setSelectedLog(log)
    setIsDetailsOpen(true)
    onLogClick?.(log)
  }

  const handleExportLogs = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Severity', 'Category'],
      ...filteredLogs.map(log => [
        format(log.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        log.user_name,
        log.action,
        log.resource_name,
        log.details,
        log.severity,
        log.category
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-trail-${format(new Date(), 'yyyy-MM-dd')}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Audit trail exported successfully')
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilterUser('all')
    setFilterAction('all')
    setFilterSeverity('all')
    setFilterCategory('all')
    setDateFrom(undefined)
    setDateTo(undefined)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (searchTerm) count++
    if (filterUser !== 'all') count++
    if (filterAction !== 'all') count++
    if (filterSeverity !== 'all') count++
    if (filterCategory !== 'all') count++
    if (dateFrom) count++
    if (dateTo) count++
    return count
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Audit Trail</h2>
            <p className="text-gray-600">Track all system activities and user actions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportLogs}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label>Search</Label>
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <Label>User</Label>
                <Select value={filterUser} onValueChange={setFilterUser}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="user1">John Doe</SelectItem>
                    <SelectItem value="user2">Sarah Johnson</SelectItem>
                    <SelectItem value="user3">Mike Wilson</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Action</Label>
                <Select value={filterAction} onValueChange={setFilterAction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="CREATE">Create</SelectItem>
                    <SelectItem value="UPDATE">Update</SelectItem>
                    <SelectItem value="DELETE">Delete</SelectItem>
                    <SelectItem value="EXPORT">Export</SelectItem>
                    <SelectItem value="SECURITY_ALERT">Security Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Severity</Label>
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
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
              </div>
              <div>
                <Label>Category</Label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="user_action">User Action</SelectItem>
                    <SelectItem value="system_event">System Event</SelectItem>
                    <SelectItem value="security_event">Security Event</SelectItem>
                    <SelectItem value="data_change">Data Change</SelectItem>
                    <SelectItem value="access_control">Access Control</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Date From</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>Date To</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <Clock className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex items-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Audit Logs ({filteredLogs.length} entries)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <Card 
                    key={log.id} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleLogClick(log)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getCategoryIcon(log.category)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{log.action}</h4>
                              <Badge className={getSeverityColor(log.severity)}>
                                {log.severity}
                              </Badge>
                              <Badge variant="outline">
                                {log.category.replace('_', ' ')}
                              </Badge>
                            </div>
                            <span className="text-xs text-gray-500">
                              {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{log.details}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>by {log.user_name}</span>
                            <span>{log.resource_type}: {log.resource_name}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Log Details Dialog */}
      {selectedLog && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedLog.category)}
                Audit Log Details
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-gray-500">Action</Label>
                  <p className="font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">User</Label>
                  <p className="font-medium">{selectedLog.user_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Resource</Label>
                  <p className="font-medium">{selectedLog.resource_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Resource Type</Label>
                  <p className="font-medium">{selectedLog.resource_type}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Severity</Label>
                  <Badge className={getSeverityColor(selectedLog.severity)}>
                    {selectedLog.severity}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Badge variant="outline">{selectedLog.category.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Timestamp</Label>
                  <p className="text-sm">{format(selectedLog.timestamp, 'PPP p')}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">IP Address</Label>
                  <p className="text-sm">{selectedLog.ip_address}</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-xs text-gray-500">Details</Label>
                <p className="text-sm mt-1">{selectedLog.details}</p>
              </div>

              {selectedLog.metadata && (
                <>
                  <Separator />
                  <div>
                    <Label className="text-xs text-gray-500">Metadata</Label>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(selectedLog.metadata, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
} 