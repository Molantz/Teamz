"use client"

import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarInset } from "@/components/ui/sidebar"
import { Network, Server, Shield, Database, Wifi, HardDrive } from "lucide-react"

const infrastructureStats = [
  { label: "Servers Online", value: "24/25", status: "good", icon: Server },
  { label: "Network Uptime", value: "99.8%", status: "excellent", icon: Network },
  { label: "Security Status", value: "Secure", status: "good", icon: Shield },
  { label: "Backup Status", value: "Current", status: "good", icon: Database },
]

const networkComponents = [
  {
    name: "Core Router",
    type: "Network",
    status: "Online",
    ip: "192.168.1.1",
    location: "Data Center Rack A1",
    uptime: "99.9%",
    icon: Network,
  },
  {
    name: "Main Firewall",
    type: "Security",
    status: "Online",
    ip: "192.168.1.2",
    location: "Data Center Rack A2",
    uptime: "99.8%",
    icon: Shield,
  },
  {
    name: "WiFi Controller",
    type: "Wireless",
    status: "Online",
    ip: "192.168.1.10",
    location: "Network Closet B",
    uptime: "99.7%",
    icon: Wifi,
  },
  {
    name: "Database Server",
    type: "Server",
    status: "Online",
    ip: "192.168.1.50",
    location: "Data Center Rack B1",
    uptime: "99.9%",
    icon: Database,
  },
]

export default function InfrastructurePage() {
  return (
    <SidebarInset>
      <Header
        title="Infrastructure Management"
        description="Monitor and manage IT infrastructure, networks, and systems"
      />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {infrastructureStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <Badge variant={stat.status === "excellent" ? "default" : "secondary"}>{stat.status}</Badge>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Network Topology */}
        <Card>
          <CardHeader>
            <CardTitle>Network Infrastructure</CardTitle>
            <CardDescription>Core network components and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {networkComponents.map((component) => (
                <Card key={component.name} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <component.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{component.name}</div>
                        <div className="text-sm text-muted-foreground">{component.type}</div>
                      </div>
                      <Badge variant="default">{component.status}</Badge>
                    </div>
                    <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <div>IP: {component.ip}</div>
                      <div>Location: {component.location}</div>
                      <div>Uptime: {component.uptime}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Primary Storage</span>
                  <span>78% Used</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: "78%" }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Backup Storage</span>
                  <span>45% Used</span>
                </div>
                <div className="h-2 bg-muted rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: "45%" }} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="font-medium">Last Full Backup</div>
                <div className="text-muted-foreground">Yesterday 2:00 AM - Success</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Last Incremental</div>
                <div className="text-muted-foreground">Today 6:00 AM - Success</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Next Scheduled</div>
                <div className="text-muted-foreground">Tonight 2:00 AM - Full Backup</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarInset>
  )
}
