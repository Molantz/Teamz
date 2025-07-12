"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Building2, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Users, 
  Laptop, 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Eye,
  Settings,
  Download,
  Upload,
  Share2,
  Users2,
  Briefcase,
  FileText,
  PieChart as PieChartIcon
} from "lucide-react"
import { departmentsApi } from "@/lib/api"
import { Department } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { auditLogger } from "@/lib/audit-log"
import { AddDepartmentModal } from "@/components/modals/add-department-modal"

interface DepartmentWithStats extends Department {
  employeeCount?: number
  assignedDevices?: number
  budgetUtilization?: number
  managerName?: string
  managerAvatar?: string
  recentActivity?: string
  status?: 'active' | 'inactive' | 'pending'
}

interface DepartmentStats {
  totalDepartments: number
  totalEmployees: number
  totalBudget: number
  totalDevices: number
  avgBudgetUtilization: number
  activeDepartments: number
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<DepartmentWithStats[]>([])
  const [filteredDepartments, setFilteredDepartments] = useState<DepartmentWithStats[]>([])
  const [stats, setStats] = useState<DepartmentStats>({
    totalDepartments: 0,
    totalEmployees: 0,
    totalBudget: 0,
    totalDevices: 0,
    avgBudgetUtilization: 0,
    activeDepartments: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedView, setSelectedView] = useState<"list" | "grid" | "chart">("list")
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | undefined>()
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const { toast } = useToast()

  // Mock data for demonstration - in real app, this would come from database
  const mockDepartments: DepartmentWithStats[] = [
    {
      id: "dept-001",
      name: "Information Technology",
      code: "IT",
      manager_id: "emp-001",
      budget: 125000,
      location: "Building A, Floor 3",
      description: "Manages all IT infrastructure, support, and development",
      created_at: "2024-01-15T00:00:00Z",
      updated_at: "2024-01-15T00:00:00Z",
      employeeCount: 25,
      assignedDevices: 78,
      budgetUtilization: 85,
      managerName: "John Smith",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "New software deployment completed",
      status: "active"
    },
    {
      id: "dept-002",
      name: "Human Resources",
      code: "HR",
      manager_id: "emp-002",
      budget: 45000,
      location: "Building A, Floor 2",
      description: "Employee relations, recruitment, and organizational development",
      created_at: "2024-01-10T00:00:00Z",
      updated_at: "2024-01-10T00:00:00Z",
      employeeCount: 12,
      assignedDevices: 24,
      budgetUtilization: 72,
      managerName: "Sarah Johnson",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "Annual review process started",
      status: "active"
    },
    {
      id: "dept-003",
      name: "Engineering",
      code: "ENG",
      manager_id: "emp-003",
      budget: 200000,
      location: "Building B, Floor 1-2",
      description: "Product development, software engineering, and technical innovation",
      created_at: "2024-01-05T00:00:00Z",
      updated_at: "2024-01-05T00:00:00Z",
      employeeCount: 45,
      assignedDevices: 135,
      budgetUtilization: 92,
      managerName: "Mike Wilson",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "New product launch scheduled",
      status: "active"
    },
    {
      id: "dept-004",
      name: "Marketing",
      code: "MKT",
      manager_id: "emp-004",
      budget: 75000,
      location: "Building A, Floor 1",
      description: "Brand management, digital marketing, and customer engagement",
      created_at: "2024-01-20T00:00:00Z",
      updated_at: "2024-01-20T00:00:00Z",
      employeeCount: 18,
      assignedDevices: 36,
      budgetUtilization: 68,
      managerName: "Emily Davis",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "Campaign performance analysis",
      status: "active"
    },
    {
      id: "dept-005",
      name: "Finance",
      code: "FIN",
      manager_id: "emp-005",
      budget: 60000,
      location: "Building A, Floor 4",
      description: "Financial planning, accounting, and budget management",
      created_at: "2024-01-12T00:00:00Z",
      updated_at: "2024-01-12T00:00:00Z",
      employeeCount: 15,
      assignedDevices: 30,
      budgetUtilization: 45,
      managerName: "David Brown",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "Q4 financial review completed",
      status: "active"
    },
    {
      id: "dept-006",
      name: "Operations",
      code: "OPS",
      manager_id: "emp-006",
      budget: 90000,
      location: "Building C, Floor 1",
      description: "Business operations, process optimization, and efficiency",
      created_at: "2024-01-08T00:00:00Z",
      updated_at: "2024-01-08T00:00:00Z",
      employeeCount: 22,
      assignedDevices: 55,
      budgetUtilization: 78,
      managerName: "Lisa Chen",
      managerAvatar: "/placeholder-user.jpg",
      recentActivity: "Process automation initiative",
      status: "active"
    }
  ]

  useEffect(() => {
    loadDepartments()
  }, [])

  useEffect(() => {
    filterDepartments()
  }, [departments, searchTerm])

  const loadDepartments = async () => {
    try {
      setLoading(true)
      // In real app, this would be: const data = await departmentsApi.getAll()
      const data = mockDepartments
      setDepartments(data)
      calculateStats(data)
      
      // Log audit trail
      auditLogger.log({
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Viewed Departments',
        entityType: 'department',
        details: `Loaded ${data.length} departments`,
        severity: 'info',
        category: 'view'
      })
    } catch (error) {
      console.error('Error loading departments:', error)
      toast({
        title: "Error",
        description: "Failed to load departments",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (deptData: DepartmentWithStats[]) => {
    const totalDepartments = deptData.length
    const totalEmployees = deptData.reduce((sum, dept) => sum + (dept.employeeCount || 0), 0)
    const totalBudget = deptData.reduce((sum, dept) => sum + (dept.budget || 0), 0)
    const totalDevices = deptData.reduce((sum, dept) => sum + (dept.assignedDevices || 0), 0)
    const avgBudgetUtilization = deptData.reduce((sum, dept) => sum + (dept.budgetUtilization || 0), 0) / totalDepartments
    const activeDepartments = deptData.filter(dept => dept.status === 'active').length

    setStats({
      totalDepartments,
      totalEmployees,
      totalBudget,
      totalDevices,
      avgBudgetUtilization: Math.round(avgBudgetUtilization),
      activeDepartments
    })
  }

  const filterDepartments = () => {
    const filtered = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.location?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredDepartments(filtered)
  }

  const handleDeleteDepartment = async (departmentId: string) => {
    try {
      // In real app: await departmentsApi.delete(departmentId)
      setDepartments(prev => prev.filter(dept => dept.id !== departmentId))
      
      auditLogger.log({
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Deleted Department',
        entityType: 'department',
        entityId: departmentId,
        details: 'Department deleted successfully',
        severity: 'warning',
        category: 'delete'
      })

      toast({
        title: "Success",
        description: "Department deleted successfully"
      })
    } catch (error) {
      console.error('Error deleting department:', error)
      toast({
        title: "Error",
        description: "Failed to delete department",
        variant: "destructive"
      })
    }
  }

  const handleExportDepartments = async () => {
    try {
      const csvContent = [
        ['Department Name', 'Code', 'Manager', 'Employees', 'Devices', 'Budget', 'Location', 'Status'],
        ...filteredDepartments.map(dept => [
          dept.name,
          dept.code,
          dept.managerName || 'N/A',
          dept.employeeCount?.toString() || '0',
          dept.assignedDevices?.toString() || '0',
          `$${dept.budget?.toLocaleString() || '0'}`,
          dept.location || 'N/A',
          dept.status || 'active'
        ])
      ].map(row => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'departments-export.csv'
      a.click()
      window.URL.revokeObjectURL(url)

      auditLogger.log({
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Exported Departments',
        entityType: 'department',
        details: `Exported ${filteredDepartments.length} departments to CSV`,
        severity: 'info',
        category: 'export'
      })

      toast({
        title: "Success",
        description: "Departments exported successfully"
      })
    } catch (error) {
      console.error('Error exporting departments:', error)
      toast({
        title: "Error",
        description: "Failed to export departments",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getBudgetUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-600'
    if (utilization >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const handleAddDepartment = () => {
    setModalMode('add')
    setEditingDepartment(undefined)
    setShowAddModal(true)
  }

  const handleEditDepartment = (department: Department) => {
    setModalMode('edit')
    setEditingDepartment(department)
    setShowAddModal(true)
  }

  const handleModalSuccess = () => {
    loadDepartments()
  }

  return (
    <SidebarInset>
      <Header title="Department Management" description="Manage departments, budgets, and organizational structure" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Departments</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDepartments}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{stats.activeDepartments}</span> active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> from last quarter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Budget Utilization</CardTitle>
              <Target className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgBudgetUtilization}%</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="budget">Budget Management</TabsTrigger>
            <TabsTrigger value="resources">Resource Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Departments Table */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Departments</CardTitle>
                    <CardDescription>Organizational structure and department management</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search departments..." 
                        className="w-[250px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportDepartments}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" onClick={handleAddDepartment}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Department
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Devices</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Utilization</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDepartments.map((department) => (
                        <TableRow key={department.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                                <Building2 className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium">{department.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {department.code} • {department.location}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={department.managerAvatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {department.managerName
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .join("") || "N/A"}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{department.managerName || "Unassigned"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{department.employeeCount || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Laptop className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{department.assignedDevices || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                ${department.budget?.toLocaleString() || 0}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={department.budgetUtilization || 0} className="w-16" />
                              <span className={`text-xs font-medium ${getBudgetUtilizationColor(department.budgetUtilization || 0)}`}>
                                {department.budgetUtilization || 0}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(department.status || 'active')}>
                              {department.status || 'active'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditDepartment(department)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit Department
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Users2 className="h-4 w-4 mr-2" />
                                  Manage Employees
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  View Budget
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Laptop className="h-4 w-4 mr-2" />
                                  Assign Devices
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="h-4 w-4 mr-2" />
                                  View Analytics
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleDeleteDepartment(department.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete Department
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Department Performance
                  </CardTitle>
                  <CardDescription>Budget utilization and employee distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDepartments.slice(0, 5).map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                          <span className="text-sm font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            {dept.employeeCount} employees
                          </span>
                          <span className={`text-sm font-medium ${getBudgetUtilizationColor(dept.budgetUtilization || 0)}`}>
                            {dept.budgetUtilization}% budget
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Budget Distribution
                  </CardTitle>
                  <CardDescription>Total budget allocation across departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredDepartments.slice(0, 5).map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          <span className="text-sm font-medium">{dept.code}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">
                            ${dept.budget?.toLocaleString()}
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round((dept.budget || 0) / stats.totalBudget * 100)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget Management
                </CardTitle>
                <CardDescription>Track budget allocation and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.code}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">${dept.budget?.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Total Budget</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span className={`font-medium ${getBudgetUtilizationColor(dept.budgetUtilization || 0)}`}>
                            {dept.budgetUtilization}%
                          </span>
                        </div>
                        <Progress value={dept.budgetUtilization || 0} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Used: ${Math.round((dept.budget || 0) * (dept.budgetUtilization || 0) / 100).toLocaleString()}</span>
                          <span>Remaining: ${Math.round((dept.budget || 0) * (100 - (dept.budgetUtilization || 0)) / 100).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users2 className="h-5 w-5" />
                  Resource Management
                </CardTitle>
                <CardDescription>Manage employees and device assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredDepartments.map((dept) => (
                    <div key={dept.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{dept.name}</h3>
                          <p className="text-sm text-muted-foreground">{dept.location}</p>
                        </div>
                        <Badge variant="outline">{dept.status}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium">Employees</span>
                          </div>
                          <div className="text-2xl font-bold">{dept.employeeCount}</div>
                          <div className="text-xs text-muted-foreground">Active staff</div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Laptop className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium">Devices</span>
                          </div>
                          <div className="text-2xl font-bold">{dept.assignedDevices}</div>
                          <div className="text-xs text-muted-foreground">Assigned equipment</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span>{dept.recentActivity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddDepartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        department={editingDepartment}
        mode={modalMode}
        onSuccess={handleModalSuccess}
      />
    </SidebarInset>
  )
}
