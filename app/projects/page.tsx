"use client"

import { useState } from "react"
import { toast } from "sonner"
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
  Loader2,
} from "lucide-react"
import { ProtectedRoute } from "@/components/protected-route"
import { useRealtime } from "@/hooks/use-realtime"
import { projectsApi, usersApi } from "@/lib/api"
import { Project, User } from "@/lib/supabase"

export default function ProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  // Real-time data
  const { data: projects, loading: projectsLoading, error: projectsError, refresh: refreshProjects } = useRealtime<Project>({
    table: 'projects',
    onDataChange: (payload) => {
      console.log('Project data changed:', payload)
      toast.success('Project data updated in real-time')
    }
  })

  const { data: users, loading: usersLoading, error: usersError } = useRealtime<User>({
    table: 'users'
  })

  // Calculate real-time stats
  const projectStats = [
    { 
      label: "Active Projects", 
      value: projects.filter(p => p.status === "Ongoing" || p.status === "Planned").length.toString(), 
      change: "+2", 
      icon: FolderKanban 
    },
    { 
      label: "Total Budget", 
      value: `$${projects.reduce((sum, p) => sum + (p.budget || 0), 0).toLocaleString()}`, 
      change: "+15%", 
      icon: DollarSign 
    },
    { 
      label: "Team Members", 
      value: projects.reduce((sum, p) => sum + (p.team_size || 0), 0).toString(), 
      change: "+8", 
      icon: Users 
    },
    { 
      label: "Completion Rate", 
      value: `${Math.round((projects.filter(p => p.status === "Completed").length / projects.length) * 100)}%`, 
      change: "+12%", 
      icon: TrendingUp 
    },
  ]

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || project.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesPriority = filterPriority === "all" || project.priority.toLowerCase() === filterPriority.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate status distribution
  const statusDistribution = {
    planned: projects.filter(p => p.status === "Planned").length,
    ongoing: projects.filter(p => p.status === "Ongoing").length,
    completed: projects.filter(p => p.status === "Completed").length,
    onHold: projects.filter(p => p.status === "On Hold").length
  }

  const handleProjectAction = (project: Project, action: string) => {
    switch (action) {
      case 'start':
        // TODO: Implement start action
        toast.info('Start project functionality coming soon')
        break
      case 'pause':
        // TODO: Implement pause action
        toast.info('Pause project functionality coming soon')
        break
      case 'complete':
        // TODO: Implement complete action
        toast.info('Complete project functionality coming soon')
        break
      default:
        break
    }
  }

  if (projectsError || usersError) {
    return (
      <ProtectedRoute>
        <SidebarInset>
          <Header title="Project Management" description="Track and manage IT projects, resources, and deliverables" />
          <div className="flex-1 space-y-6 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-red-600 mb-2">Error loading projects</div>
                <Button onClick={refreshProjects} variant="outline">Retry</Button>
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
                <div className="text-2xl font-bold text-blue-600">{statusDistribution.planned}</div>
                <p className="text-xs text-muted-foreground">Ready to start</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Ongoing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{statusDistribution.ongoing}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{statusDistribution.completed}</div>
                <p className="text-xs text-muted-foreground">Successfully finished</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">On Hold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{statusDistribution.onHold}</div>
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
                    <Input 
                      placeholder="Search projects..." 
                      className="w-[250px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                        All Statuses
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("planned")}>
                        Planned
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("ongoing")}>
                        Ongoing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("completed")}>
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setFilterStatus("on hold")}>
                        On Hold
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Loading projects...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Manager</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.map((project) => {
                      const manager = users.find(u => u.id === project.manager_id)
                      
                      return (
                        <TableRow key={project.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{project.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {project.description.substring(0, 100)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {manager ? (
                              <div className="flex items-center space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={manager.avatar || ""} />
                                  <AvatarFallback>{manager.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm">{manager.name}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">Unassigned</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={project.status === "Completed" ? "default" : 
                                     project.status === "Ongoing" ? "secondary" : 
                                     project.status === "Planned" ? "outline" : "destructive"}
                            >
                              {project.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{project.progress || 0}%</span>
                              </div>
                              <Progress value={project.progress || 0} className="h-2" />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {project.budget ? `$${project.budget.toLocaleString()}` : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {project.start_date && project.end_date ? (
                                <div>
                                  <div>{new Date(project.start_date).toLocaleDateString()}</div>
                                  <div className="text-muted-foreground">to {new Date(project.end_date).toLocaleDateString()}</div>
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No dates set</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => handleProjectAction(project, 'start')}>
                                  Start Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleProjectAction(project, 'pause')}>
                                  Pause Project
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleProjectAction(project, 'complete')}>
                                  Mark Complete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </ProtectedRoute>
  )
}
