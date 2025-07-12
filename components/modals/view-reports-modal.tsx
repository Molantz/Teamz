"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { auditLogger } from "@/lib/audit-log"
import { TrendingUp, FileText, Download, Calendar, Users, Laptop, ShieldAlert, BarChart3 } from "lucide-react"

interface ViewReportsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}

const reportTypes = [
  { id: "user-performance", name: "User Performance Report", icon: Users, description: "Individual and team performance metrics" },
  { id: "asset-inventory", name: "Asset Inventory Report", icon: Laptop, description: "Complete device and software inventory" },
  { id: "incident-analysis", name: "Incident Analysis Report", icon: ShieldAlert, description: "IT incidents and resolution times" },
  { id: "system-health", name: "System Health Report", icon: BarChart3, description: "Infrastructure and system performance" },
  { id: "cost-analysis", name: "Cost Analysis Report", icon: TrendingUp, description: "IT spending and budget utilization" },
  { id: "compliance", name: "Compliance Report", icon: FileText, description: "Security and regulatory compliance status" }
]

const timeRanges = [
  "Last 7 days",
  "Last 30 days", 
  "Last 3 months",
  "Last 6 months",
  "Last year",
  "Custom range"
]

const exportFormats = [
  "PDF",
  "Excel",
  "CSV",
  "JSON"
]

export function ViewReportsModal({ open, onOpenChange, onSubmit }: ViewReportsModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedReport, setSelectedReport] = useState("")
  const [timeRange, setTimeRange] = useState("Last 30 days")
  const [exportFormat, setExportFormat] = useState("PDF")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const handleGenerateReport = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const reportData = {
        id: `RPT-${Date.now()}`,
        type: selectedReport,
        timeRange,
        exportFormat,
        customStartDate,
        customEndDate,
        generatedAt: new Date().toISOString(),
        status: "Completed"
      }
      
      if (onSubmit) {
        onSubmit(reportData)
      }
      
      toast.success("Report generated successfully")
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Generated report',
        'report',
        reportData.id,
        `Generated ${reportTypes.find(r => r.id === selectedReport)?.name} report`
      )
      
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to generate report")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadReport = async (reportId: string) => {
    setIsLoading(true)
    
    try {
      // Simulate download
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Report downloaded successfully")
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Downloaded report',
        'report',
        reportId,
        'Downloaded report file'
      )
    } catch (error) {
      toast.error("Failed to download report")
    } finally {
      setIsLoading(false)
    }
  }

  const recentReports = [
    {
      id: "RPT-001",
      name: "User Performance Report",
      type: "user-performance",
      generatedAt: "2024-01-15 10:30:00",
      status: "Completed",
      fileSize: "2.3 MB"
    },
    {
      id: "RPT-002", 
      name: "Asset Inventory Report",
      type: "asset-inventory",
      generatedAt: "2024-01-14 15:45:00",
      status: "Completed",
      fileSize: "1.8 MB"
    },
    {
      id: "RPT-003",
      name: "Incident Analysis Report", 
      type: "incident-analysis",
      generatedAt: "2024-01-13 09:20:00",
      status: "Completed",
      fileSize: "3.1 MB"
    }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            View Reports
          </DialogTitle>
          <DialogDescription>
            Generate and view comprehensive IT reports and analytics
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate New Report</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reportTypes.map((report) => (
                <Card 
                  key={report.id}
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedReport === report.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedReport(report.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <report.icon className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-sm">{report.name}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{report.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {selectedReport && (
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                  <CardDescription>Configure report parameters and export options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="timeRange">Time Range</Label>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exportFormat">Export Format</Label>
                      <Select value={exportFormat} onValueChange={setExportFormat}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {exportFormats.map((format) => (
                            <SelectItem key={format} value={format}>
                              {format}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {timeRange === "Custom range" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="customStartDate">Start Date</Label>
                        <Input
                          id="customStartDate"
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="customEndDate">End Date</Label>
                        <Input
                          id="customEndDate"
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <div className="space-y-4">
              {recentReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {reportTypes.find(r => r.id === report.type)?.icon && (
                          <reportTypes.find(r => r.id === report.type)!.icon className="h-5 w-5 text-blue-600" />
                        )}
                        <div>
                          <div className="font-medium">{report.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Generated: {new Date(report.generatedAt).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.fileSize}</Badge>
                        <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                      disabled={isLoading}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {selectedReport && (
            <Button 
              onClick={handleGenerateReport} 
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 