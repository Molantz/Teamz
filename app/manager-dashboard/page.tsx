"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { Users, AlertTriangle, FileText, Wrench, Package, BarChart3, CheckCircle, XCircle, TrendingUp, Download, ChevronRight } from "lucide-react"
import { auditLogger } from "@/lib/audit-log"

const pendingApprovals = [
  { id: "REQ-001", type: "Device Assignment", user: "Tom Davis", item: "Dell Latitude 5420", date: "2024-02-01", status: "Pending" },
  { id: "INC-002", type: "Incident Resolution", user: "Sarah Johnson", item: "Printer Offline", date: "2024-02-02", status: "Pending" },
  { id: "PUR-003", type: "Purchase Request", user: "Mike Wilson", item: "HP LaserJet Toner", date: "2024-02-03", status: "Pending" },
]

const openIncidents = [
  { id: "INC-101", title: "Network Outage", priority: "High", assignedTo: "Network Team", status: "Open" },
  { id: "INC-102", title: "Printer Jam", priority: "Medium", assignedTo: "Printer Technician", status: "In Progress" },
  { id: "INC-103", title: "Software Crash", priority: "High", assignedTo: "Software Technician", status: "Open" },
]

const technicianPerformance = [
  { name: "John Smith", completed: 12, avgTime: "1.8h", rating: 4.9 },
  { name: "Sarah Johnson", completed: 9, avgTime: "2.1h", rating: 4.7 },
  { name: "Mike Wilson", completed: 15, avgTime: "1.5h", rating: 4.8 },
]

const inventoryAlerts = [
  { item: "HP LaserJet Toner", level: 5, threshold: 10 },
  { item: "Cat6 Network Cable", level: 12, threshold: 20 },
  { item: "Dell Latitude 5420", level: 2, threshold: 5 },
]

export default function ManagerDashboardPage() {
  const [approvals, setApprovals] = useState(pendingApprovals)

  const handleApproval = (id: string, action: "approve" | "reject") => {
    const approval = approvals.find((a) => a.id === id)
    setApprovals((prev) => prev.filter((a) => a.id !== id))
    toast.success(
      action === "approve"
        ? "Request approved successfully."
        : "Request rejected."
    )
    if (approval) {
      auditLogger.logUserAction(
        "current-manager",
        "Current Manager",
        action === "approve" ? "Approved request" : "Rejected request",
        approval.type.toLowerCase().replace(/ /g, "_"),
        approval.id,
        `${action === "approve" ? "Approved" : "Rejected"} ${approval.type} for ${approval.user}: ${approval.item}`
      )
    }
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
              <div className="text-2xl font-bold">{approvals.length}</div>
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
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            <CardDescription>Approve or reject requests and actions</CardDescription>
          </CardHeader>
          <CardContent>
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
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell>{approval.id}</TableCell>
                    <TableCell>{approval.type}</TableCell>
                    <TableCell>{approval.user}</TableCell>
                    <TableCell>{approval.item}</TableCell>
                    <TableCell>{approval.date}</TableCell>
                    <TableCell>
                      <span className="text-yellow-600 font-semibold">{approval.status}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => handleApproval(approval.id, "approve")}>Approve</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleApproval(approval.id, "reject")}>Reject</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Open Incidents Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Open Incidents</CardTitle>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4 mr-2" /> Escalate
              </Button>
            </div>
            <CardDescription>Monitor and escalate unresolved incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {openIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>{incident.id}</TableCell>
                    <TableCell>{incident.title}</TableCell>
                    <TableCell>
                      <span className={incident.priority === "High" ? "text-red-600 font-semibold" : "text-yellow-600 font-semibold"}>{incident.priority}</span>
                    </TableCell>
                    <TableCell>{incident.assignedTo}</TableCell>
                    <TableCell>{incident.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Technician Performance Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Technician Performance</CardTitle>
              <Button variant="outline" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" /> Report
              </Button>
            </div>
            <CardDescription>Track technician productivity and ratings</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell>{tech.name}</TableCell>
                    <TableCell>{tech.completed}</TableCell>
                    <TableCell>{tech.avgTime}</TableCell>
                    <TableCell>{tech.rating}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Inventory Alerts Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Alerts</CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" /> Export
              </Button>
            </div>
            <CardDescription>Monitor low stock and replenish inventory</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <TableCell>{alert.item}</TableCell>
                    <TableCell>{alert.level}</TableCell>
                    <TableCell>{alert.threshold}</TableCell>
                    <TableCell>
                      <span className={alert.level < alert.threshold ? "text-red-600 font-semibold" : "text-green-600 font-semibold"}>
                        {alert.level < alert.threshold ? "Low" : "OK"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button className="w-full" variant="outline">
            <Wrench className="h-4 w-4 mr-2" /> Assign Work Order
          </Button>
          <Button className="w-full" variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" /> View Analytics
          </Button>
          <Button className="w-full" variant="outline">
            <FileText className="h-4 w-4 mr-2" /> Export Reports
          </Button>
          <Button className="w-full" variant="outline">
            <AlertTriangle className="h-4 w-4 mr-2" /> Escalate Incident
          </Button>
        </div>
      </div>
    </SidebarInset>
  )
} 