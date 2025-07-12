"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  User, 
  Building2, 
  Phone, 
  Mail,
  Eye,
  Edit,
  Package,
  FileText,
  CreditCard,
  History,
  Download,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { usersApi, assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { User as UserType, Asset, Incident, Request } from "@/lib/supabase"
import { auditLogger } from "@/lib/audit-log"

interface EmployeeWithStats extends UserType {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  last_login?: string
  avatar?: string
  phone?: string
  position?: string
  employee_id?: string
  join_date?: string
  created_at: string
  updated_at: string
  assignedDevices?: number
  activeIncidents?: number
  completedIncidents?: number
}

interface EmployeeStats {
  totalEmployees: number
  activeEmployees: number
  newThisMonth: number
  pendingOnboarding: number
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeWithStats[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [addEmployeeModal, setAddEmployeeModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithStats | null>(null)

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      role: "Employee",
      status: "Active",
      employee_id: "",
    },
  })

  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [usersData, assetsData, incidentsData, requestsData] = await Promise.all([
          usersApi.getAll(),
          assetsApi.getAll(),
          incidentsApi.getAll(),
          requestsApi.getAll()
        ])
        
        setEmployees(usersData.map(user => ({
          ...user,
          assignedDevices: assetsData.filter(asset => asset.assigned_to === user.id).length,
          activeIncidents: incidentsData.filter(incident => incident.assignee === user.id && (incident.status === "New" || incident.status === "In Progress")).length,
          completedIncidents: incidentsData.filter(incident => incident.assignee === user.id && incident.status === "Resolved").length
        })))
        setAssets(assetsData)
        setIncidents(incidentsData)
        setRequests(requestsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load employee data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate real-time stats
  const employeeStats: EmployeeStats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter(emp => emp.status === "Active").length,
    newThisMonth: employees.filter(emp => {
      const joinDate = new Date(emp.created_at)
      const now = new Date()
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
    }).length,
    pendingOnboarding: requests.filter(req => req.status === "Pending" && req.type === "Onboarding").length
  }

  // Filter employees based on search and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || employee.department === filterDepartment
    const matchesStatus = !filterStatus || employee.status === filterStatus
    
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleAddEmployee = async (formData: any) => {
    try {
      const newEmployee = await usersApi.create(formData)
      const employeeWithStats = {
        ...newEmployee,
        assignedDevices: 0,
        activeIncidents: 0,
        completedIncidents: 0
      }
      
      setEmployees([...employees, employeeWithStats])
      setAddEmployeeModal(false)
      form.reset()
      
      toast.success(`Employee ${formData.name} added successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created employee',
        'employee',
        newEmployee.id,
        `Created employee: ${newEmployee.name} (${newEmployee.email})`
      )
    } catch (error) {
      console.error('Failed to create employee:', error)
      toast.error('Failed to create employee')
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await usersApi.delete(employeeId)
      setEmployees(employees.filter(emp => emp.id !== employeeId))
      toast.success('Employee deleted successfully')
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Deleted employee',
        'employee',
        employeeId,
        'Employee deleted from system'
      )
    } catch (error) {
      console.error('Failed to delete employee:', error)
      toast.error('Failed to delete employee')
    }
  }

  const handleViewProfile = (employee: EmployeeWithStats) => {
    setSelectedEmployee(employee)
    toast.info(`View Profile for ${employee.name} - Would open profile modal`)
  }

  const handleEditEmployee = (employee: EmployeeWithStats) => {
    setSelectedEmployee(employee)
    toast.info(`Edit Employee ${employee.name} - Would open edit modal`)
  }

  const handleAssignDevices = (employee: EmployeeWithStats) => {
    setSelectedEmployee(employee)
    toast.info(`Assign Devices to ${employee.name} - Would open device assignment modal`)
  }

  const handleViewDocuments = (employee: EmployeeWithStats) => {
    setSelectedEmployee(employee)
    toast.info(`View Documents for ${employee.name} - Would open documents modal`)
  }

  const handleGenerateIDCard = (employee: EmployeeWithStats) => {
    try {
      const cardData = {
        name: employee.name,
        employeeId: employee.employee_id || employee.id,
        department: employee.department,
        position: employee.position,
        generatedAt: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(cardData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${employee.name.replace(/\s+/g, '_')}_ID_Card_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success(`ID Card generated for ${employee.name}`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Generated ID card',
        'employee',
        employee.id,
        `Generated ID card for ${employee.name}`
      )
    } catch (error) {
      console.error('Failed to generate ID card:', error)
      toast.error('Failed to generate ID card')
    }
  }

  const handleEmploymentHistory = (employee: EmployeeWithStats) => {
    setSelectedEmployee(employee)
    toast.info(`Employment History for ${employee.name} - Would open history modal`)
  }

  const handleExportEmployees = () => {
    try {
      const exportData = filteredEmployees.map(emp => ({
        Name: emp.name,
        Email: emp.email,
        Phone: emp.phone || "",
        Department: emp.department,
        Position: emp.position,
        EmployeeID: emp.employee_id || emp.id,
        Status: emp.status,
        'Assigned Devices': emp.assignedDevices,
        'Active Incidents': emp.activeIncidents,
        'Completed Incidents': emp.completedIncidents,
        'Join Date': emp.join_date || emp.created_at
      }))

      const headers = Object.keys(exportData[0] || {}).join(',')
      const rows = exportData.map(row => Object.values(row).join(',')).join('\n')
      const csv = `${headers}\n${rows}`
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `employees_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Employees exported successfully')
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Exported employees',
        'export',
        'employees',
        `Exported ${exportData.length} employees`
      )
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  if (loading) {
    return (
      <SidebarInset>
        <Header title="Employee Management" description="Manage employee profiles, assignments, and documentation" />
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading employees...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <Header title="Employee Management" description="Manage employee profiles, assignments, and documentation" />
      <div className="flex-1 space-y-6 p-6">
        {/* Real-time Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.activeEmployees}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3</span> from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
              <User className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employeeStats.pendingOnboarding}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+2</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Employees Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>Complete employee information and IT assignments</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search employees..." 
                    className="w-[250px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportEmployees}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setAddEmployeeModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No employees found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Assigned Devices</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                            <AvatarFallback>
                              {employee.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{employee.name}</div>
                            <div className="text-sm text-muted-foreground">{employee.employee_id || employee.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{employee.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>{employee.position || employee.role}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span>{employee.email}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{employee.phone || "N/A"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.assignedDevices} devices</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                          {employee.status}
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
                            <DropdownMenuItem onClick={() => handleViewProfile(employee)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Employee
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAssignDevices(employee)}>
                              <Package className="h-4 w-4 mr-2" />
                              Assign Devices
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewDocuments(employee)}>
                              <FileText className="h-4 w-4 mr-2" />
                              View Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleGenerateIDCard(employee)}>
                              <CreditCard className="h-4 w-4 mr-2" />
                              Generate ID Card
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEmploymentHistory(employee)}>
                              <History className="h-4 w-4 mr-2" />
                              Employment History
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Employee
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

        {/* Add Employee Modal */}
        {addEmployeeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New Employee</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleAddEmployee)}
                  className="space-y-4"
                >
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter full name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter email address" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter phone number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="department" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter department" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="position" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter position" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="employee_id" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employee ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter employee ID" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="role" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter role" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="status" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Active/Inactive" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setAddEmployeeModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Employee</Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        )}
      </div>
    </SidebarInset>
  )
}
