"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  BarChart3,
  Calendar,
  Clock,
  Download,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  TrendingUp,
  Users,
  Loader2,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { reportsApi } from "@/lib/api"
import { Report } from "@/lib/supabase"

export default function ReportsPage() {
  const [createReportModal, setCreateReportModal] = useState(false)
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; report: any }>({ open: false, report: null })
  const [previewModal, setPreviewModal] = useState<{ open: boolean; report: any }>({ open: false, report: null })
  const [searchTerm, setSearchTerm] = useState("")

  // Real-time data
  const { data: reports, loading: reportsLoading, error: reportsError, refresh: refreshReports } = useRealtime<Report>({
    table: 'reports',
    onDataChange: (payload) => {
      console.log('Report data changed:', payload)
      toast.success('Report data updated in real-time')
    }
  })

  // Calculate real-time stats
  const reportStats = [
    { 
      label: "Active Reports", 
      value: reports.filter(r => r.is_active).length.toString(), 
      change: "+3", 
      icon: FileText 
    },
    { 
      label: "Scheduled Reports", 
      value: reports.filter(r => r.frequency && r.is_active).length.toString(), 
      change: "+2", 
      icon: Calendar 
    },
    { 
      label: "Reports Sent Today", 
      value: reports.filter(r => {
        if (!r.last_generated) return false
        const generatedDate = new Date(r.last_generated)
        const today = new Date()
        return generatedDate.toDateString() === today.toDateString()
      }).length.toString(), 
      change: "+12", 
      icon: Mail 
    },
    { 
      label: "Avg Generation Time", 
      value: "2.3s", 
      change: "-0.5s", 
      icon: Clock 
    },
  ]

  // Filter reports based on search
  const filteredReports = reports.filter(report => {
    return report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
           report.category?.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handleReportAction = (report: Report, action: string) => {
    switch (action) {
      case 'schedule':
        setScheduleModal({ open: true, report })
        break
      case 'preview':
        setPreviewModal({ open: true, report })
        break
      case 'download':
        // TODO: Implement download action
        toast.info('Download functionality coming soon')
        break
      default:
        break
    }
  }

  if (reportsError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header
            title="Reporting & Analytics"
            description="Comprehensive reporting system with automated scheduling and delivery"
          />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading reports</div>
                <Button onClick={refreshReports} variant="outline">Retry</Button>
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
        <Header
          title="Reporting & Analytics"
          description="Comprehensive reporting system with automated scheduling and delivery"
        />
        <div className="flex-1 space-y-6 p-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {reportStats.map((stat) => (
              <Card key={stat.label}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600">{stat.change}</span> from last week
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="scheduled" className="space-y-6">
            <TabsList>
              <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
              <TabsTrigger value="templates">Report Templates</TabsTrigger>
              <TabsTrigger value="executions">Recent Executions</TabsTrigger>
            </TabsList>

            <TabsContent value="scheduled" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Scheduled Reports</CardTitle>
                      <CardDescription>Automated reports with delivery schedules</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search reports..." 
                          className="w-[250px] pl-8"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button size="sm" onClick={() => setCreateReportModal(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Report
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {reportsLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <Loader2 className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading reports...</span>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Report Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Frequency</TableHead>
                          <TableHead>Next Run</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredReports.filter(r => r.frequency).map((report) => (
                          <TableRow key={report.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{report.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {report.description || "No description"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{report.type}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {report.frequency}
                                {report.schedule_time && (
                                  <div className="text-muted-foreground">
                                    {report.schedule_time}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {report.next_generation ? 
                                  new Date(report.next_generation).toLocaleString() : 
                                  "Not scheduled"
                                }
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={report.is_active ? "default" : "secondary"}
                              >
                                {report.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => handleReportAction(report, 'schedule')}>
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReportAction(report, 'preview')}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleReportAction(report, 'download')}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Report Templates</CardTitle>
                      <CardDescription>Predefined report templates and configurations</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm">{report.name}</CardTitle>
                            <Badge variant="outline">{report.type}</Badge>
                          </div>
                          <CardDescription>
                            {report.description || "No description available"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Category:</span> {report.category || "General"}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Frequency:</span> {report.frequency || "On-demand"}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button size="sm" variant="outline" onClick={() => handleReportAction(report, 'preview')}>
                                Preview
                              </Button>
                              <Button size="sm" onClick={() => handleReportAction(report, 'schedule')}>
                                Schedule
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="executions" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Executions</CardTitle>
                      <CardDescription>Latest report generation history</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredReports.filter(r => r.last_generated).slice(0, 10).map((report) => (
                      <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-full">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Generated {report.last_generated ? new Date(report.last_generated).toLocaleString() : "Unknown"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Completed</Badge>
                          <Button size="sm" variant="ghost" onClick={() => handleReportAction(report, 'download')}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* TODO: Add modals when components are created */}
        </div>
      </SidebarInset>
    </ProtectedRoute>
  )
}
