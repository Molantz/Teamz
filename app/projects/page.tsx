"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Calendar,
  DollarSign,
  Filter,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  TrendingUp,
} from "lucide-react"

const projects = [
  {
    id: "PRJ-001",
    name: "Network Infrastructure Upgrade",
    description: "Upgrade core network infrastructure to support increased bandwidth",
    status: "Ongoing",
    priority: "High",
    progress: 65,
    budget: "$125,000",
    spent: "$81,250",
    startDate: "2024-01-15",
    endDate: "2024-03-15",
    manager: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    teamSize: 5,
    tasksCompleted: 13,
    totalTasks: 20,
  },
  {
    id: "PRJ-002",
    name: "Security System Implementation",
    description: "Deploy new security monitoring and threat detection systems",
    status: "Planned",
    priority: "High",
    progress: 15,
    budget: "$85,000",
    spent: "$12,750",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    manager: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    teamSize: 3,
    tasksCompleted: 2,
    totalTasks: 15,
  },
  {
    id: "PRJ-003",
    name: "Cloud Migration Phase 2",
    description: "Migrate remaining legacy systems to cloud infrastructure",
    status: "Ongoing",
    priority: "Medium",
    progress: 40,
    budget: "$200,000",
    spent: "$80,000",
    startDate: "2023-11-01",
    endDate: "2024-04-30",
    manager: {
      name: "Mike Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    teamSize: 8,
    tasksCompleted: 24,
    totalTasks: 60,
  },
  {
    id: "PRJ-004",
    name: "Employee Device Refresh",
    description: "Replace aging laptops and workstations across all departments",
    status: "Completed",
    priority: "Medium",
    progress: 100,
    budget: "$150,000",
    spent: "$147,500",
    startDate: "2023-09-01",
    endDate: "2023-12-31",
    manager: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    teamSize: 4,
    tasksCompleted: 25,
    totalTasks: 25,
  },
]

const projectStats = [
  { label: "Active Projects", value: "8", change: "+2", icon: FolderKanban },
  { label: "Total Budget", value: "$2.1M", change: "+15%", icon: DollarSign },
  { label: "Team Members", value: "45", change: "+8", icon: Users },
  { label: "Completion Rate", value: "78%", change: "+12%", icon: TrendingUp },
]

export default function ProjectsPage() {
  return (
    <SidebarInset>
      <Header title="Project Management" description="Track and manage IT projects, resources, and deliverables" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {projectStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last quarter
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Project Status Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Planned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">3</div>
              <p className="text-xs text-muted-foreground">Ready to start</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ongoing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">5</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">12</div>
              <p className="text-xs text-muted-foreground">Successfully finished</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">On Hold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">1</div>
              <p className="text-xs text-muted-foreground">Temporarily paused</p>
            </CardContent>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>IT Projects</CardTitle>
                <CardDescription>Current and upcoming IT projects and initiatives</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search projects..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{project.name}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">{project.description}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{project.id}</span>
                          <span>•</span>
                          <span>
                            {project.tasksCompleted}/{project.totalTasks} tasks
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === "Completed"
                            ? "default"
                            : project.status === "Ongoing"
                              ? "secondary"
                              : project.status === "Planned"
                                ? "outline"
                                : "destructive"
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>{project.progress}%</span>
                          <Badge
                            variant={
                              project.priority === "High"
                                ? "destructive"
                                : project.priority === "Medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {project.priority}
                          </Badge>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.manager.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {project.manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{project.manager.name}</div>
                          <div className="text-xs text-muted-foreground">{project.teamSize} members</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{project.budget}</div>
                        <div className="text-xs text-muted-foreground">Spent: {project.spent}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{project.startDate}</span>
                        </div>
                        <div className="text-xs">to {project.endDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Project</DropdownMenuItem>
                          <DropdownMenuItem>Manage Team</DropdownMenuItem>
                          <DropdownMenuItem>View Timeline</DropdownMenuItem>
                          <DropdownMenuItem>Budget Report</DropdownMenuItem>
                          <DropdownMenuItem>Project Files</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SidebarInset>
  )
}
