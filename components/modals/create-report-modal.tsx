"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FileText, Users, Building2, BarChart3, CalendarIcon, Save, Eye } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

interface CreateReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateReportModal({ open, onOpenChange }: CreateReportModalProps) {
  const [reportType, setReportType] = useState("")
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const reportTypes = [
    {
      id: "individual",
      name: "Individual Performance Report",
      description: "Personal performance metrics and KPIs for individual employees",
      icon: Users,
      category: "User Reports",
      fields: [
        "Tasks Completed",
        "Hours Worked",
        "Projects Assigned",
        "Incidents Resolved",
        "Response Time",
        "Productivity Score",
        "Training Completed",
        "Goals Achievement",
      ],
    },
    {
      id: "team",
      name: "Team Performance Report",
      description: "Team-wide productivity and collaboration metrics",
      icon: Users,
      category: "Team Reports",
      fields: [
        "Team Productivity",
        "Collaboration Score",
        "Project Progress",
        "Resource Utilization",
        "Team Goals",
        "Communication Metrics",
        "Knowledge Sharing",
        "Team Satisfaction",
      ],
    },
    {
      id: "department",
      name: "Department Performance Report",
      description: "Comprehensive department analytics for stakeholders",
      icon: Building2,
      category: "Department Reports",
      fields: [
        "Department KPIs",
        "Budget Utilization",
        "Employee Performance",
        "Project Delivery",
        "Cost per Employee",
        "ROI Metrics",
        "Efficiency Ratings",
        "Strategic Goals",
      ],
    },
    {
      id: "operations",
      name: "Daily Operations Report",
      description: "Daily operational metrics and system status",
      icon: BarChart3,
      category: "Operations Reports",
      fields: [
        "System Uptime",
        "Incident Count",
        "Request Volume",
        "Response Times",
        "Resource Usage",
        "Performance Metrics",
        "Error Rates",
        "Service Levels",
      ],
    },
    {
      id: "assets",
      name: "Asset Management Report",
      description: "IT asset inventory and utilization analysis",
      icon: FileText,
      category: "Asset Reports",
      fields: [
        "Asset Inventory",
        "Utilization Rates",
        "Maintenance Status",
        "Lifecycle Analysis",
        "Cost Analysis",
        "Assignment Status",
        "Warranty Status",
        "Depreciation",
      ],
    },
    {
      id: "financial",
      name: "Financial Performance Report",
      description: "Budget, expenses, and financial KPIs",
      icon: BarChart3,
      category: "Financial Reports",
      fields: [
        "Budget vs Actual",
        "Cost Centers",
        "Expense Categories",
        "ROI Analysis",
        "Cost per Project",
        "Vendor Spending",
        "Budget Forecasting",
        "Financial Trends",
      ],
    },
  ]

  const frequencies = [
    { value: "daily", label: "Daily", description: "Every day at specified time" },
    { value: "weekly", label: "Weekly", description: "Every week on specified day" },
    { value: "monthly", label: "Monthly", description: "Every month on specified date" },
    { value: "quarterly", label: "Quarterly", description: "Every 3 months" },
    { value: "on-demand", label: "On-Demand", description: "Manual generation only" },
  ]

  const recipientGroups = [
    { id: "user", label: "Report Subject", description: "The employee the report is about" },
    { id: "manager", label: "Direct Manager", description: "Employee's direct manager" },
    { id: "supervisor", label: "Supervisor", description: "Department supervisor" },
    { id: "team", label: "Team Members", description: "All team members" },
    { id: "department", label: "Department", description: "All department members" },
    { id: "stakeholders", label: "Stakeholders", description: "Board members and executives" },
    { id: "custom", label: "Custom Recipients", description: "Manually specified email addresses" },
  ]

  const handleFieldToggle = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]))
  }

  const selectedReportType = reportTypes.find((type) => type.id === reportType)

  const handleSave = () => {
    // Handle report creation logic
    console.log("Creating report:", {
      type: reportType,
      fields: selectedFields,
      scheduleEnabled,
      selectedDate,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create New Report
          </DialogTitle>
          <DialogDescription>Configure a new automated report with custom fields and scheduling</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="template" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="fields">Fields</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
          </TabsList>

          {/* Template Selection */}
          <TabsContent value="template" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Select Report Template</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTypes.map((type) => (
                  <Card
                    key={type.id}
                    className={`cursor-pointer transition-colors ${
                      reportType === type.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setReportType(type.id)}
                  >
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <type.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base">{type.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {type.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="mt-3">
                        <div className="text-xs font-medium mb-2">Available Fields:</div>
                        <div className="flex flex-wrap gap-1">
                          {type.fields.slice(0, 4).map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                          {type.fields.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{type.fields.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {selectedReportType && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Selected Template</h4>
                  <div className="flex items-center gap-3">
                    <selectedReportType.icon className="h-8 w-8 text-primary" />
                    <div>
                      <div className="font-medium">{selectedReportType.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedReportType.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Fields Configuration */}
          <TabsContent value="fields" className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-name">Report Name</Label>
                <Input id="report-name" placeholder="Enter report name" defaultValue={selectedReportType?.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-description">Description</Label>
                <Textarea id="report-description" placeholder="Describe what this report includes..." rows={3} />
              </div>
            </div>

            <Separator />

            {selectedReportType && (
              <div>
                <h3 className="font-medium mb-4">Select Report Fields</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {selectedReportType.fields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <Label htmlFor={field} className="text-sm font-normal">
                        {field}
                      </Label>
                    </div>
                  ))}
                </div>

                {selectedFields.length > 0 && (
                  <Card className="mt-4 bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Selected Fields ({selectedFields.length})</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedFields.map((field) => (
                          <Badge key={field} variant="default" className="text-xs">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Report Filters</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-quarter">Last quarter</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department-filter">Department Filter</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="All departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="it">IT Department</SelectItem>
                      <SelectItem value="hr">HR Department</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Schedule Configuration */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch id="enable-schedule" checked={scheduleEnabled} onCheckedChange={setScheduleEnabled} />
              <Label htmlFor="enable-schedule">Enable Automated Scheduling</Label>
            </div>

            {scheduleEnabled && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Schedule Frequency</h3>
                  <div className="grid gap-3">
                    {frequencies.map((freq) => (
                      <Card key={freq.value} className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="frequency"
                              value={freq.value}
                              className="h-4 w-4"
                              id={freq.value}
                            />
                            <div>
                              <Label htmlFor={freq.value} className="font-medium cursor-pointer">
                                {freq.label}
                              </Label>
                              <p className="text-sm text-muted-foreground">{freq.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Schedule Time</Label>
                    <Input type="time" defaultValue="10:00" />
                  </div>

                  <div className="space-y-2">
                    <Label>Schedule Day</Label>
                    <Select defaultValue="friday">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                        <SelectItem value="sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Recipients Configuration */}
          <TabsContent value="recipients" className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Email Recipients</h3>
              <div className="space-y-3">
                {recipientGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox id={group.id} />
                    <div>
                      <Label htmlFor={group.id} className="font-medium">
                        {group.label}
                      </Label>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Custom Email Addresses</h3>
              <div className="space-y-2">
                <Label htmlFor="custom-emails">Additional Recipients</Label>
                <Textarea id="custom-emails" placeholder="Enter email addresses separated by commas..." rows={3} />
                <p className="text-xs text-muted-foreground">
                  Enter one email per line or separate multiple emails with commas
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-medium">Email Settings</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Email Subject Template</Label>
                  <Input
                    id="email-subject"
                    placeholder="Weekly Performance Report - {{employee_name}}"
                    defaultValue="{{report_name}} - {{date}}"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email-body">Email Body Template</Label>
                  <Textarea
                    id="email-body"
                    placeholder="Email body template..."
                    rows={4}
                    defaultValue="Please find attached your {{report_name}} for {{date_range}}. This report includes {{field_count}} key metrics and insights."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="attach-pdf" defaultChecked />
                  <Label htmlFor="attach-pdf">Attach PDF report</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="attach-excel" />
                  <Label htmlFor="attach-excel">Attach Excel spreadsheet</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Create Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
