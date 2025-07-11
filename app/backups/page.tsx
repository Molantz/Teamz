"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SidebarInset } from "@/components/ui/sidebar"
import { Database, HardDrive, Cloud, CheckCircle, AlertTriangle, Clock } from "lucide-react"

const backupStats = [
  { label: "Last Full Backup", value: "Success", status: "good", time: "2h ago", icon: Database },
  { label: "Incremental Backup", value: "Success", status: "good", time: "30m ago", icon: HardDrive },
  { label: "Cloud Sync", value: "Active", status: "good", time: "Live", icon: Cloud },
  { label: "Recovery Point", value: "Current", status: "good", time: "Up to date", icon: CheckCircle },
]

const backupJobs = [
  {
    name: "Database Full Backup",
    type: "Full",
    status: "Completed",
    lastRun: "2024-01-15 02:00:00",
    nextRun: "2024-01-16 02:00:00",
    size: "2.3 GB",
    duration: "45 minutes",
  },
  {
    name: "File Server Incremental",
    type: "Incremental",
    status: "Completed",
    lastRun: "2024-01-15 06:00:00",
    nextRun: "2024-01-15 18:00:00",
    size: "156 MB",
    duration: "8 minutes",
  },
  {
    name: "Email Archive",
    type: "Full",
    status: "Running",
    lastRun: "2024-01-15 14:30:00",
    nextRun: "2024-01-22 14:30:00",
    size: "1.8 GB",
    duration: "Estimated 25 min",
  },
  {
    name: "User Data Sync",
    type: "Differential",
    status: "Failed",
    lastRun: "2024-01-15 12:00:00",
    nextRun: "2024-01-15 16:00:00",
    size: "N/A",
    duration: "Failed after 5 min",
  },
]

export default function BackupsPage() {
  return (
    <SidebarInset>
      <Header title="Backup Management" description="Monitor and manage system backups and data recovery" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {backupStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.time}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Backup Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Jobs</CardTitle>
            <CardDescription>Scheduled backup tasks and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {backupJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium">{job.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {job.type} • {job.size} • {job.duration}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Last: {job.lastRun}</div>
                      <div className="text-muted-foreground">Next: {job.nextRun}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "Completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {job.status === "Running" && <Clock className="h-4 w-4 text-blue-500" />}
                      {job.status === "Failed" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <Badge
                        variant={
                          job.status === "Completed"
                            ? "default"
                            : job.status === "Running"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Manual Backup</CardTitle>
              <CardDescription>Run backup jobs manually when needed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Run Full Database Backup
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <HardDrive className="h-4 w-4 mr-2" />
                Run File System Backup
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Cloud className="h-4 w-4 mr-2" />
                Sync to Cloud Storage
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery Options</CardTitle>
              <CardDescription>Data recovery and restoration tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <CheckCircle className="h-4 w-4 mr-2" />
                Test Recovery Point
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <Database className="h-4 w-4 mr-2" />
                Restore from Backup
              </Button>
              <Button className="w-full justify-start bg-transparent" variant="outline">
                <HardDrive className="h-4 w-4 mr-2" />
                Browse Backup Archive
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
