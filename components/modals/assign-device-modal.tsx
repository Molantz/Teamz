"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Laptop, Search, CalendarIcon, Camera, CheckCircle } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"

interface AssignDeviceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  employeeId: string
}

export function AssignDeviceModal({ open, onOpenChange, employeeName, employeeId }: AssignDeviceModalProps) {
  const [selectedDevice, setSelectedDevice] = useState<string>("")
  const [assignmentDate, setAssignmentDate] = useState<Date>()
  const [scheduleMaintenance, setScheduleMaintenance] = useState(false)

  const availableDevices = [
    {
      id: "DEV-005",
      name: "MacBook Pro 16",
      type: "Laptop",
      status: "Available",
      condition: "New",
      location: "Warehouse A",
      specs: "M2 Pro, 16GB RAM, 512GB SSD",
    },
    {
      id: "DEV-006",
      name: "Dell Latitude 7430",
      type: "Laptop",
      status: "Available",
      condition: "Excellent",
      location: "Warehouse A",
      specs: "Intel i7, 16GB RAM, 256GB SSD",
    },
    {
      id: "DEV-007",
      name: "iPad Pro 12.9",
      type: "Tablet",
      status: "Available",
      condition: "Good",
      location: "Warehouse B",
      specs: "M2 Chip, 256GB, WiFi + Cellular",
    },
  ]

  const handleAssign = () => {
    // Handle device assignment logic
    console.log("Assigning device:", selectedDevice, "to:", employeeId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Laptop className="h-5 w-5" />
            Assign Device
          </DialogTitle>
          <DialogDescription>
            Assign IT equipment to {employeeName} ({employeeId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Device Selection */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="device-search">Search Available Devices</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="device-search" placeholder="Search by name, type, or ID..." className="pl-8" />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Available Devices ({availableDevices.length})</Label>
              {availableDevices.map((device) => (
                <Card
                  key={device.id}
                  className={`cursor-pointer transition-colors ${
                    selectedDevice === device.id ? "ring-2 ring-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedDevice(device.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Laptop className="h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="font-medium">{device.name}</div>
                          <div className="text-sm text-muted-foreground">{device.specs}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{device.id}</span>
                            <span>•</span>
                            <span>{device.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="outline">{device.type}</Badge>
                        <Badge variant="default">{device.status}</Badge>
                        <Badge variant={device.condition === "New" ? "default" : "secondary"}>{device.condition}</Badge>
                      </div>
                    </div>
                    {selectedDevice === device.id && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Selected for assignment
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Assignment Details */}
          <div className="space-y-4">
            <h3 className="font-medium">Assignment Details</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignment-type">Assignment Type</Label>
                <Select defaultValue="permanent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="project">Project-based</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assignment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {assignmentDate ? format(assignmentDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={assignmentDate} onSelect={setAssignmentDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-notes">Assignment Notes</Label>
              <Textarea
                id="assignment-notes"
                placeholder="Add any special instructions or notes for this assignment..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="schedule-maintenance"
                checked={scheduleMaintenance}
                onCheckedChange={setScheduleMaintenance}
              />
              <Label htmlFor="schedule-maintenance">Schedule maintenance reminder</Label>
            </div>

            {scheduleMaintenance && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="maintenance-interval">Maintenance Interval</Label>
                <Select defaultValue="3months">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">1 Month</SelectItem>
                    <SelectItem value="3months">3 Months</SelectItem>
                    <SelectItem value="6months">6 Months</SelectItem>
                    <SelectItem value="1year">1 Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Separator />

          {/* Document Upload */}
          <div className="space-y-4">
            <h3 className="font-medium">Assignment Documentation</h3>

            <div className="space-y-2">
              <Label>Upload Assignment Form (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input type="file" accept=".pdf,.jpg,.jpeg,.png" className="flex-1" />
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Upload signed assignment form or take a photo</p>
            </div>
          </div>

          {/* Assignment Summary */}
          {selectedDevice && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Assignment Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Device:</span>
                    <span className="font-medium">{availableDevices.find((d) => d.id === selectedDevice)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employee:</span>
                    <span className="font-medium">{employeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assignment Date:</span>
                    <span className="font-medium">{assignmentDate ? format(assignmentDate, "PPP") : "Not set"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className="font-medium">{scheduleMaintenance ? "Scheduled" : "Not scheduled"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedDevice}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Assign Device
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
