"use client"

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
} from "lucide-react"
import { useState } from "react"

import { CreateReportModal } from "@/components/modals/create-report-modal"
import { ReportScheduleModal } from "@/components/modals/report-schedule-modal"
import { ReportPreviewModal } from "@/components/modals/report-preview-modal"

const reportStats = [
  { label: "Active Reports", value: "24", change: "+3", icon: FileText },
  { label: "Scheduled Reports", value: "18", change: "+2", icon: Calendar },
  { label: "Reports Sent Today", value: "47", change: "+12", icon: Mail },
  { label: "Avg Generation Time", value: "2.3s", change: "-0.5s", icon: Clock },
]

const scheduledReports = [
  {
    id: "RPT-001",
    name: "Individual Performance Report",
    type: "User Report",
    frequency: "Weekly",
    schedule: "Friday 10:00 AM",
    recipients: ["user@company.com", "manager@company.com", "supervisor@company.com"],
    lastRun: "2024-01-12 10:00:00",
    nextRun: "2024-01-19 10:00:00",
    status: "Active",
  },
  {
    id: "RPT-002",
    name: "Daily Operations Summary",
    type: "Operations Report",
    frequency: "Daily",
    schedule: "Daily 8:00 AM",
    recipients: ["team@company.com", "manager@company.com"],
    lastRun: "2024-01-15 08:00:00",
    nextRun: "2024-01-16 08:00:00",
    status: "Active",
  },
  {
    id: "RPT-003",
    name: "Department Performance Dashboard",
    type: "Department Report",
    frequency: "Monthly",
    schedule: "1st of month 9:00 AM",
    recipients: ["shareholders@company.com", "board@company.com"],
    lastRun: "2024-01-01 09:00:00",
    nextRun: "2024-02-01 09:00:00",
    status: "Active",
  },
  {
    id: "RPT-004",
    name: "IT Asset Utilization Report",
    type: "Asset Report",
    frequency: "Weekly",
    schedule: "Monday 7:00 AM",
    recipients: ["it-team@company.com", "finance@company.com"],
    lastRun: "2024-01-15 07:00:00",
    nextRun: "2024-01-22 07:00:00",
    status: "Active",
  },
]

const reportTemplates = [
  {
    id: "TPL-001",
    name: "Individual Performance Report",
    category: "User Reports",
    description: "Comprehensive individual performance metrics and KPIs",
    fields: ["Tasks Completed", "Hours Worked", "Projects", "Incidents Resolved"],
    frequency: ["Daily", "Weekly", "Monthly"],
  },
  {
    id: "TPL-002",
    name: "Team Productivity Report",
    category: "Team Reports",
    description: "Team-wide productivity metrics and collaboration stats",
    fields: ["Team Performance", "Collaboration Score", "Project Progress", "Resource Utilization"],
    frequency: ["Daily", "Weekly", "Monthly"],
  },
  {
    id: "TPL-003",
    name: "Department Financial Report",
    category: "Financial Reports",
    description: "Department budget, expenses, and ROI analysis",
    fields: ["Budget Utilization", "Cost per Employee", "ROI Metrics", "Expense Breakdown"],
    frequency: ["Weekly", "Monthly", "Quarterly"],
  },
  {
    id: "TPL-004",
    name: "IT Infrastructure Report",
    category: "Technical Reports",
    description: "System health, uptime, and infrastructure metrics",
    fields: ["System Uptime", "Performance Metrics", "Security Status", "Maintenance Schedule"],
    frequency: ["Daily", "Weekly", "Monthly"],
  },
  {
    id: "TPL-005",
    name: "Incident Analysis Report",
    category: "Operations Reports",
    description: "Incident trends, resolution times, and impact analysis",
    fields: ["Incident Count", "Resolution Time", "Impact Analysis", "Trend Analysis"],
    frequency: ["Daily", "Weekly", "Monthly"],
  },
  {
    id: "TPL-006",
    name: "Asset Management Report",
    category: "Asset Reports",
    description: "Device inventory, assignments, and lifecycle management",
    fields: ["Asset Inventory", "Assignment Status", "Maintenance Due", "Lifecycle Status"],
    frequency: ["Weekly", "Monthly"],
  },
]

const recentExecutions = [
  {
    id: "EXE-001",
    reportName: "Daily Operations Summary",
    status: "Completed",
    executionTime: "1.2s",
    recipientsSent: 5,
    generatedAt: "2024-01-15 08:00:12",
    fileSize: "2.3 MB",
  },
  {
    id: "EXE-002",
    reportName: "Individual Performance Report",
    status: "Completed",
    executionTime: "3.1s",
    recipientsSent: 3,
    generatedAt: "2024-01-12 10:00:05",
    fileSize: "1.8 MB",
  },
  {
    id: "EXE-003",
    reportName: "IT Asset Utilization Report",
    status: "Failed",
    executionTime: "0.5s",
    recipientsSent: 0,
    generatedAt: "2024-01-15 07:00:00",
    error: "Database connection timeout",
  },
  {
    id: "EXE-004",
    reportName: "Department Performance Dashboard",
    status: "In Progress",
    executionTime: "-",
    recipientsSent: 0,
    generatedAt: "2024-01-15 14:30:00",
  },
]

export default function ReportsPage() {
  const [createReportModal, setCreateReportModal] = useState(false)
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; report: any }>({ open: false, report: null })
  const [previewModal, setPreviewModal] = useState<{ open: boolean; report: any }>({ open: false, report: null })

  return (
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="executions">Recent Executions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Scheduled Reports */}
          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Automated reports with email delivery</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search reports..." className="w-[250px] pl-8" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button size="sm" onClick={() => setCreateReportModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Report
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-muted-foreground">{report.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{report.schedule}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{report.recipients.length} recipients</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{report.status}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{report.nextRun}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setPreviewModal({ open: true, report })}>
                                Preview Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>Run Now</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setScheduleModal({ open: true, report })}>
                                Edit Schedule
                              </DropdownMenuItem>
                              <DropdownMenuItem>View History</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Templates */}
          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Report Templates</CardTitle>
                    <CardDescription>Pre-built report templates for quick setup</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {reportTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <Badge variant="outline" className="mt-1">
                              {template.category}
                            </Badge>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Use Template</DropdownMenuItem>
                              <DropdownMenuItem>Preview</DropdownMenuItem>
                              <DropdownMenuItem>Edit Template</DropdownMenuItem>
                              <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                        <div className="space-y-2">
                          <div className="text-xs font-medium">Included Fields:</div>
                          <div className="flex flex-wrap gap-1">
                            {template.fields.slice(0, 3).map((field) => (
                              <Badge key={field} variant="secondary" className="text-xs">
                                {field}
                              </Badge>
                            ))}
                            {template.fields.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{template.fields.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t">
                          <div className="text-xs font-medium mb-1">Available Frequencies:</div>
                          <div className="flex gap-1">
                            {template.frequency.map((freq) => (
                              <Badge key={freq} variant="outline" className="text-xs">
                                {freq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Executions */}
          <TabsContent value="executions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Report Executions</CardTitle>
                <CardDescription>History of report generation and delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Execution Time</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Generated At</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExecutions.map((execution) => (
                      <TableRow key={execution.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{execution.reportName}</div>
                            <div className="text-sm text-muted-foreground">{execution.id}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              execution.status === "Completed"
                                ? "default"
                                : execution.status === "Failed"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {execution.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{execution.executionTime}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Send className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{execution.recipientsSent} sent</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{execution.generatedAt}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{execution.fileSize || "N/A"}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Report
                              </DropdownMenuItem>
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Resend Email</DropdownMenuItem>
                              {execution.status === "Failed" && <DropdownMenuItem>Retry Execution</DropdownMenuItem>}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Report Generation Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>Report analytics chart will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Report Usage by Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { dept: "IT Department", reports: 12, percentage: 45 },
                      { dept: "HR Department", reports: 8, percentage: 30 },
                      { dept: "Finance", reports: 4, percentage: 15 },
                      { dept: "Operations", reports: 3, percentage: 10 },
                    ].map((item) => (
                      <div key={item.dept} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.dept}</span>
                          <span className="text-muted-foreground">{item.reports} reports</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Report Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">98.5%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.1s</div>
                    <div className="text-sm text-muted-foreground">Avg Generation Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">1,247</div>
                    <div className="text-sm text-muted-foreground">Reports Generated</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">99.2%</div>
                    <div className="text-sm text-muted-foreground">Email Delivery Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <CreateReportModal open={createReportModal} onOpenChange={setCreateReportModal} />

      {scheduleModal.report && (
        <ReportScheduleModal
          open={scheduleModal.open}
          onOpenChange={(open) => setScheduleModal({ open, report: open ? scheduleModal.report : null })}
          report={scheduleModal.report}
        />
      )}

      {previewModal.report && (
        <ReportPreviewModal
          open={previewModal.open}
          onOpenChange={(open) => setPreviewModal({ open, report: open ? previewModal.report : null })}
          report={previewModal.report}
        />
      )}
    </SidebarInset>
  )
}
