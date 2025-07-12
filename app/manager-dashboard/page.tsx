"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { 
  Users, 
  AlertTriangle, 
  FileText, 
  Wrench, 
  Package, 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Download, 
  ChevronRight,
  Clock,
  Star,
  UserCheck,
  Settings,
  Activity
} from "lucide-react"
import { auditLogger } from "@/lib/audit-log"
import { usersApi, assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { User, Asset, Incident, Request } from "@/lib/supabase"

// Types for manager dashboard
interface PendingApproval {
  id: string
  type: string
  user: string
  item: string
  date: string
  status: string
  requestId: string
}

interface TechnicianPerformance {
  name: string
  completed: number
  avgTime: string
  rating: number
  userId: string
}

interface InventoryAlert {
  item: string
  level: number
  threshold: number
  assetId: string
}

export default function ManagerDashboardPage() {
  // State for real-time data
  const [users, setUsers] = useState<User[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  // Derived state for dashboard
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [openIncidents, setOpenIncidents] = useState<Incident[]>([])
  const [technicianPerformance, setTechnicianPerformance] = useState<TechnicianPerformance[]>([])
  const [inventoryAlerts, setInventoryAlerts] = useState<InventoryAlert[]>([])

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
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Process data for dashboard sections
  useEffect(() => {
    // Process pending approvals (requests that need approval)
    const approvals = requests
      .filter(request => request.status === "Pending")
      .map(request => ({
        id: request.id,
        type: request.type,
        user: request.requester || "Unknown",
        item: request.title,
        date: new Date(request.created_at).toLocaleDateString(),
        status: "Pending",
        requestId: request.id
      }))
    setPendingApprovals(approvals)

    // Process open incidents
    const openIncidentsData = incidents.filter(incident => 
      incident.status === "New" || incident.status === "In Progress"
    )
    setOpenIncidents(openIncidentsData)

    // Process technician performance (users with technician role)
    const technicians = users.filter(user => user.role === "technician" || user.role === "Technician")
    const performanceData = technicians.map(tech => ({
      name: tech.name,
      completed: Math.floor(Math.random() * 20) + 5, // Mock data - in real app, calculate from incidents
      avgTime: `${(Math.random() * 2 + 1).toFixed(1)}h`,
      rating: parseFloat((Math.random() * 1 + 4).toFixed(1)),
      userId: tech.id
    }))
    setTechnicianPerformance(performanceData)

    // Process inventory alerts (assets with low stock/availability)
    const alerts = assets
      .filter(asset => asset.status === "Available")
      .slice(0, 5) // Show top 5 alerts
      .map(asset => ({
        item: asset.name,
        level: Math.floor(Math.random() * 10) + 1, // Mock stock level
        threshold: Math.floor(Math.random() * 15) + 5, // Mock threshold
        assetId: asset.id
      }))
    setInventoryAlerts(alerts)
  }, [users, assets, incidents, requests])

  // Handle approval actions
  const handleApproval = async (id: string, action: "approve" | "reject") => {
    try {
      const approval = pendingApprovals.find((a) => a.id === id)
      if (!approval) return

      // Update request status in database
      await requestsApi.update(approval.requestId, {
        status: action === "approve" ? "Approved" : "Rejected"
      })

      // Remove from pending approvals
      setPendingApprovals(prev => prev.filter(a => a.id !== id))
      
      // Refresh requests data
      const updatedRequests = await requestsApi.getAll()
      setRequests(updatedRequests)

      toast.success(
        action === "approve"
          ? "Request approved successfully."
          : "Request rejected."
      )

      // Log the action
      auditLogger.logUserAction(
        "current-manager",
        "Current Manager",
        action === "approve" ? "Approved request" : "Rejected request",
        "request",
        approval.requestId,
        `${action === "approve" ? "Approved" : "Rejected"} ${approval.type} for ${approval.user}: ${approval.item}`
      )
    } catch (error) {
      console.error('Failed to update request:', error)
      toast.error('Failed to update request')
    }
  }

  // Handle incident escalation
  const handleEscalateIncident = async (incidentId: string) => {
    try {
      await incidentsApi.update(incidentId, {
        priority: "High",
        status: "Escalated"
      })

      // Refresh incidents data
      const updatedIncidents = await incidentsApi.getAll()
      setIncidents(updatedIncidents)

      toast.success("Incident escalated successfully")
      
      auditLogger.logUserAction(
        "current-manager",
        "Current Manager",
        "Escalated incident",
        "incident",
        incidentId,
        "Incident escalated to high priority"
      )
    } catch (error) {
      console.error('Failed to escalate incident:', error)
      toast.error('Failed to escalate incident')
    }
  }

  // Export functionality
  const handleExport = async (type: string, data: any[]) => {
    try {
      // Convert data to CSV format
      const headers = Object.keys(data[0] || {}).join(',')
      const rows = data.map(item => Object.values(item).join(',')).join('\n')
      const csv = `${headers}\n${rows}`
      
      // Create and download file
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${type}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success(`${type} exported successfully`)
      
      auditLogger.logUserAction(
        "current-manager",
        "Current Manager",
        `Exported ${type}`,
        "export",
        "dashboard",
        `Exported ${data.length} ${type} records`
      )
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  // Generate technician performance report
  const handleGenerateReport = () => {
    try {
      const reportData = {
        generatedAt: new Date().toISOString(),
        totalTechnicians: technicianPerformance.length,
        averageCompleted: technicianPerformance.reduce((sum, tech) => sum + tech.completed, 0) / technicianPerformance.length,
        averageRating: technicianPerformance.reduce((sum, tech) => sum + tech.rating, 0) / technicianPerformance.length,
        technicians: technicianPerformance
      }

      // Create and download report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `technician_performance_report_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success("Performance report generated successfully")
      
      auditLogger.logUserAction(
        "current-manager",
        "Current Manager",
        "Generated technician performance report",
        "report",
        "dashboard",
        `Generated performance report for ${technicianPerformance.length} technicians`
      )
    } catch (error) {
      console.error('Report generation failed:', error)
      toast.error('Failed to generate report')
    }
  }

  // Quick action handlers
  const handleAssignWorkOrder = () => {
    toast.info("Assign Work Order functionality - Navigate to technicians page")
  }

  const handleViewAnalytics = () => {
    toast.info("View Analytics functionality - Navigate to analytics page")
  }

  const handleExportReports = () => {
    handleExport("Dashboard_Reports", [
      { section: "Pending Approvals", count: pendingApprovals.length },
      { section: "Open Incidents", count: openIncidents.length },
      { section: "Technician Performance", count: technicianPerformance.length },
      { section: "Inventory Alerts", count: inventoryAlerts.length }
    ])
  }

  const handleEscalateIncidentGlobal = () => {
    if (openIncidents.length > 0) {
      handleEscalateIncident(openIncidents[0].id)
    } else {
      toast.info("No incidents available to escalate")
    }
  }

  if (loading) {
    return (
      <SidebarInset>
        <Header title="Manager Dashboard" description="Overview and quick actions for IT managers and supervisors" />
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading manager dashboard...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <Header title="Manager Dashboard" description="Overview and quick actions for IT managers and supervisors" />
      <div className="flex-1 space-y-6 p-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApprovals.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting your action</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{openIncidents.length}</div>
              <p className="text-xs text-muted-foreground">Unresolved issues</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Technician Performance</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{technicianPerformance.reduce((a, t) => a + t.completed, 0)}</div>
              <p className="text-xs text-muted-foreground">Tasks completed this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
              <Package className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inventoryAlerts.length}</div>
              <p className="text-xs text-muted-foreground">Low stock items</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport("Pending_Approvals", pendingApprovals)}
                disabled={pendingApprovals.length === 0}
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            <CardDescription>Approve or reject requests and actions</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No pending approvals</p>
                <p className="text-sm">All requests have been processed</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell>{approval.id}</TableCell>
                      <TableCell>{approval.type}</TableCell>
                      <TableCell>{approval.user}</TableCell>
                      <TableCell>{approval.item}</TableCell>
                      <TableCell>{approval.date}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{approval.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="default" onClick={() => handleApproval(approval.id, "approve")}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleApproval(approval.id, "reject")}>
                            <XCircle className="h-3 w-3 mr-1" /> Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Open Incidents Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Open Incidents</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport("Open_Incidents", openIncidents)}
                disabled={openIncidents.length === 0}
              >
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            <CardDescription>Monitor and escalate unresolved incidents</CardDescription>
          </CardHeader>
          <CardContent>
            {openIncidents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No open incidents</p>
                <p className="text-sm">All incidents have been resolved</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {openIncidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell>{incident.id}</TableCell>
                      <TableCell>{incident.title}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={incident.priority === "High" ? "destructive" : "default"}
                        >
                          {incident.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.assignee || "Unassigned"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{incident.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEscalateIncident(incident.id)}
                        >
                          <ChevronRight className="h-3 w-3 mr-1" /> Escalate
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Technician Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Technician Performance</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleGenerateReport}
                disabled={technicianPerformance.length === 0}
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Report
              </Button>
            </div>
            <CardDescription>Track technician productivity and ratings</CardDescription>
          </CardHeader>
          <CardContent>
            {technicianPerformance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-blue-500" />
                <p>No technician data available</p>
                <p className="text-sm">Add technicians to see performance metrics</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Avg. Time</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicianPerformance.map((tech) => (
                    <TableRow key={tech.name}>
                      <TableCell className="font-medium">{tech.name}</TableCell>
                      <TableCell>{tech.completed}</TableCell>
                      <TableCell>{tech.avgTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {tech.rating}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Alerts</CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleExport("Inventory_Alerts", inventoryAlerts)}
                disabled={inventoryAlerts.length === 0}
              >
                <FileText className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            <CardDescription>Monitor low stock and replenish inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {inventoryAlerts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>No inventory alerts</p>
                <p className="text-sm">All inventory levels are within normal range</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inventoryAlerts.map((alert) => (
                    <TableRow key={alert.item}>
                      <TableCell className="font-medium">{alert.item}</TableCell>
                      <TableCell>{alert.level}</TableCell>
                      <TableCell>{alert.threshold}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={alert.level < alert.threshold ? "destructive" : "default"}
                        >
                          {alert.level < alert.threshold ? "Low" : "OK"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="w-full" variant="outline" onClick={handleAssignWorkOrder}>
            <Wrench className="h-4 w-4 mr-2" /> Assign Work Order
          </Button>
          <Button className="w-full" variant="outline" onClick={handleViewAnalytics}>
            <TrendingUp className="h-4 w-4 mr-2" /> View Analytics
          </Button>
          <Button className="w-full" variant="outline" onClick={handleExportReports}>
            <FileText className="h-4 w-4 mr-2" /> Export Reports
          </Button>
          <Button className="w-full" variant="outline" onClick={handleEscalateIncidentGlobal}>
            <AlertTriangle className="h-4 w-4 mr-2" /> Escalate Incident
          </Button>
        </div>
      </div>
    </SidebarInset>
  )
} 