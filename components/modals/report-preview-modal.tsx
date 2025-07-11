"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { auditLogger } from "@/lib/audit-log"
import {
  Download,
  Mail,
  FileText,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"

interface ReportPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report?: any
}

export function ReportPreviewModal({ open, onOpenChange, report }: ReportPreviewModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Report downloaded successfully")
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Downloaded report preview',
        'report',
        report?.id || 'unknown',
        `Downloaded report: ${report?.name || 'Unknown Report'}`
      )
    } catch (error) {
      toast.error("Failed to download report")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    setIsLoading(true)
    try {
      // Simulate sending
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Report sent successfully")
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Sent report preview',
        'report',
        report?.id || 'unknown',
        `Sent report: ${report?.name || 'Unknown Report'}`
      )
    } catch (error) {
      toast.error("Failed to send report")
    } finally {
      setIsLoading(false)
    }
  }

  const mockReportData = {
    name: report?.name || "Sample Report",
    type: report?.type || "Performance Report",
    generatedAt: new Date().toISOString(),
    data: {
      summary: {
        totalUsers: 156,
        activeUsers: 142,
        avgResponseTime: "2.3h",
        satisfactionScore: 4.8,
      },
      metrics: [
        { label: "Tasks Completed", value: "1,234", change: "+12%" },
        { label: "Hours Worked", value: "8,456", change: "+8%" },
        { label: "Projects Active", value: "23", change: "+3" },
        { label: "Incidents Resolved", value: "89", change: "-5%" },
      ],
      charts: [
        {
          title: "Performance Trends",
          type: "line",
          data: [
            { month: "Jan", value: 85 },
            { month: "Feb", value: 88 },
            { month: "Mar", value: 92 },
            { month: "Apr", value: 89 },
            { month: "May", value: 94 },
            { month: "Jun", value: 91 },
          ],
        },
        {
          title: "Department Distribution",
          type: "pie",
          data: [
            { department: "IT", value: 35 },
            { department: "Sales", value: 25 },
            { department: "Marketing", value: 20 },
            { department: "HR", value: 15 },
            { department: "Finance", value: 5 },
          ],
        },
      ],
    },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Report Preview: {mockReportData.name}
          </DialogTitle>
          <DialogDescription>
            Preview the generated report before downloading or sending to recipients
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{mockReportData.name}</CardTitle>
                  <CardDescription>{mockReportData.type}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(mockReportData.generatedAt).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(mockReportData.generatedAt).toLocaleTimeString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Report Content */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Executive Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Total Users</p>
                      <p className="text-2xl font-bold">{mockReportData.data.summary.totalUsers}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Active Users</p>
                      <p className="text-2xl font-bold">{mockReportData.data.summary.activeUsers}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium">Avg Response</p>
                      <p className="text-2xl font-bold">{mockReportData.data.summary.avgResponseTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Satisfaction</p>
                      <p className="text-2xl font-bold">{mockReportData.data.summary.satisfactionScore}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {mockReportData.data.metrics.map((metric) => (
                      <div key={metric.label} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{metric.label}</p>
                          <p className="text-2xl font-bold">{metric.value}</p>
                        </div>
                        <Badge variant={metric.change.startsWith('+') ? 'default' : 'secondary'}>
                          {metric.change}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Performance Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 flex items-end justify-between gap-1">
                      {mockReportData.data.charts[0].data.map((item, index) => (
                        <div key={index} className="flex-1 bg-blue-100 rounded-t" style={{ height: `${item.value}%` }}>
                          <div className="text-xs text-center mt-1">{item.month}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Department Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {mockReportData.data.charts[1].data.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm">{item.department}</span>
                          <Badge variant="outline">{item.value}%</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium mb-2">Report Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Report ID:</span>
                          <span className="font-mono">RPT-{Date.now()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Generated:</span>
                          <span>{new Date(mockReportData.generatedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Format:</span>
                          <span>PDF</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span>2.3 MB</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Data Sources</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>User Database:</span>
                          <span>✓ Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Analytics API:</span>
                          <span>✓ Connected</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance DB:</span>
                          <span>✓ Connected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator />

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            {isLoading ? "Downloading..." : "Download"}
          </Button>
          <Button onClick={handleSend} disabled={isLoading}>
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? "Sending..." : "Send Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 