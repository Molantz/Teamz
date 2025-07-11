"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Save, Settings } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

interface ReportScheduleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: {
    id: string
    name: string
    type: string
    frequency: string
    schedule: string
    status: string
  }
}

export function ReportScheduleModal({ open, onOpenChange, report }: ReportScheduleModalProps) {
  const [isActive, setIsActive] = useState(report.status === "Active")
  const [frequency, setFrequency] = useState(report.frequency.toLowerCase())
  const [scheduleTime, setScheduleTime] = useState("10:00")
  const [scheduleDay, setScheduleDay] = useState("friday")
  const [startDate, setStartDate] = useState<Date>()

  const handleSave = () => {
    // Handle schedule update logic
    console.log("Updating schedule for:", report.id)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Edit Report Schedule
          </DialogTitle>
          <DialogDescription>Configure automated scheduling for {report.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Info */}
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{report.name}</h4>
                  <p className="text-sm text-muted-foreground">{report.id}</p>
                </div>
                <Badge variant="outline">{report.type}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Status */}
          <div className="flex items-center space-x-2">
            <Switch id="schedule-active" checked={isActive} onCheckedChange={setIsActive} />
            <Label htmlFor="schedule-active">Enable Automated Scheduling</Label>
          </div>

          {isActive && (
            <div className="space-y-6">
              {/* Frequency Selection */}
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time and Day Configuration */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule-time">Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="schedule-time"
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                {frequency === "weekly" && (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-day">Day of Week</Label>
                    <Select value={scheduleDay} onValueChange={setScheduleDay}>
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
                )}

                {frequency === "monthly" && (
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Day of Month</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st</SelectItem>
                        <SelectItem value="15">15th</SelectItem>
                        <SelectItem value="last">Last day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Schedule Preview */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Schedule Preview</h4>
                  <div className="text-sm text-blue-800">
                    {frequency === "daily" && `Report will be generated daily at ${scheduleTime}`}
                    {frequency === "weekly" && `Report will be generated every ${scheduleDay} at ${scheduleTime}`}
                    {frequency === "monthly" && `Report will be generated monthly at ${scheduleTime}`}
                    {frequency === "quarterly" && `Report will be generated quarterly at ${scheduleTime}`}
                  </div>
                  {startDate && (
                    <div className="text-sm text-blue-800 mt-1">Starting from {format(startDate, "PPP")}</div>
                  )}
                </CardContent>
              </Card>

              {/* Advanced Options */}
              <div className="space-y-4">
                <h4 className="font-medium">Advanced Options</h4>
                <div>{/* Placeholder for advanced options */}</div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
