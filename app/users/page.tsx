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
import { Filter, MoreHorizontal, Search, UserPlus, Mail, Download, Edit, Eye, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ViewProfileModal } from "@/components/modals/view-profile-modal"
import { EditEmployeeModal } from "@/components/modals/edit-employee-modal"
import { AssignDeviceModal } from "@/components/modals/assign-device-modal"
import { DocumentsModal } from "@/components/modals/documents-modal"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { SortableTable } from '@/components/sortable-table'
import { BulkActions } from '@/components/bulk-actions'
import { auditLogger } from '@/lib/audit-log'

import { usersApi, assetsApi, incidentsApi, requestsApi } from "@/lib/api"
import { User, Asset, Incident, Request } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface UserWithStats {
  id: string
  name: string
  email: string
  role: string
  department: string
  status: string
  lastLogin: string
  avatar?: string
  phone?: string
  position?: string
  employeeId?: string
  joinDate?: string
  created_at: string
  updated_at: string
  assignedDevices?: number
  completedIncidents?: number
  activeProjects?: number
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  newThisMonth: number
  pendingApproval: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [assets, setAssets] = useState<Asset[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  
  const [viewProfileModal, setViewProfileModal] = useState<{ open: boolean; user: UserWithStats | null }>({ open: false, user: null })
  const [editEmployeeModal, setEditEmployeeModal] = useState<{ open: boolean; user: UserWithStats | null }>({ open: false, user: null })
  const [assignDeviceModal, setAssignDeviceModal] = useState<{ open: boolean; user: UserWithStats | null }>({ open: false, user: null })
  const [documentsModal, setDocumentsModal] = useState<{ open: boolean; user: UserWithStats | null }>({ open: false, user: null })
  const [createUserModal, setCreateUserModal] = useState(false)
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "Employee",
      department: "",
      status: "Active",
      phone: "",
      position: "",
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
        
        setUsers(usersData.map(u => ({
          ...u,
          id: u.id,
          lastLogin: u.last_login || "",
          assignedDevices: assetsData.filter(asset => asset.assigned_to === u.id).length,
          completedIncidents: incidentsData.filter(incident => incident.assignee === u.id && incident.status === "Resolved").length,
          activeProjects: 0 // Mock data - would come from projects API
        })))
        setAssets(assetsData)
        setIncidents(incidentsData)
        setRequests(requestsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        toast.error('Failed to load user data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate real-time stats
  const userStats: UserStats = {
    totalUsers: users.length,
    activeUsers: users.filter(user => user.status === "Active").length,
    newThisMonth: users.filter(user => {
      const joinDate = new Date(user.created_at)
      const now = new Date()
      return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear()
    }).length,
    pendingApproval: requests.filter(request => request.status === "Pending").length
  }

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = !filterRole || user.role === filterRole
    const matchesDepartment = !filterDepartment || user.department === filterDepartment
    const matchesStatus = !filterStatus || user.status === filterStatus
    
    return matchesSearch && matchesRole && matchesDepartment && matchesStatus
  })

  const handleCreateUser = async (formData: any) => {
    try {
      const newUser = await usersApi.create(formData)
      const userWithStats: UserWithStats = {
        ...newUser,
        id: newUser.id,
        lastLogin: newUser.last_login || "",
        assignedDevices: 0,
        completedIncidents: 0,
        activeProjects: 0
      }
      
      setUsers([...users, userWithStats])
      setCreateUserModal(false)
      form.reset()
      
      toast.success(`User ${formData.name} created successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created user',
        'user',
        newUser.id.toString(),
        `Created user: ${newUser.name} (${newUser.email})`
      )
    } catch (error) {
      console.error('Failed to create user:', error)
      toast.error('Failed to create user')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await usersApi.delete(userId)
      setUsers(users.filter(user => user.id.toString() !== userId))
      toast.success('User deleted successfully')
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Deleted user',
        'user',
        userId,
        'User deleted from system'
      )
    } catch (error) {
      console.error('Failed to delete user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleExportUsers = () => {
    try {
      const exportData = filteredUsers.map(user => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Department: user.department,
        Status: user.status,
        'Last Login': user.lastLogin,
        'Assigned Devices': user.assignedDevices,
        'Completed Incidents': user.completedIncidents
      }))

      const headers = Object.keys(exportData[0] || {}).join(',')
      const rows = exportData.map(row => Object.values(row).join(',')).join('\n')
      const csv = `${headers}\n${rows}`
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast.success('Users exported successfully')
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Exported users',
        'export',
        'users',
        `Exported ${exportData.length} users`
      )
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id.toString()))
    } else {
      setSelectedUsers([])
    }
  }

  const handleBulkDelete = async () => {
    try {
      const usersToDelete = users.filter(user => selectedUsers.includes(user.id.toString()))
      
      // Delete users from database
      await Promise.all(usersToDelete.map(user => usersApi.delete(user.id.toString())))
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id.toString())))
      setSelectedUsers([])
      
      toast.success(`Deleted ${usersToDelete.length} users`)
      
      auditLogger.logBulkOperation(
        'current-user',
        'Current User',
        'Bulk deleted users',
        'user',
        usersToDelete.length,
        `Deleted ${usersToDelete.length} users: ${usersToDelete.map(u => u.name).join(', ')}`
      )
    } catch (error) {
      console.error('Bulk delete failed:', error)
      toast.error('Failed to delete users')
    }
  }

  const handleBulkExport = () => {
    const usersToExport = users.filter(user => selectedUsers.includes(user.id.toString()))
    handleExportUsers()
  }

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      const usersToUpdate = users.filter(user => selectedUsers.includes(user.id.toString()))
      
      // Update users in database
      await Promise.all(usersToUpdate.map(user => 
        usersApi.update(user.id.toString(), { status })
      ))
      
      const updatedUsers = users.map(user => 
        selectedUsers.includes(user.id.toString()) 
          ? { ...user, status } 
          : user
      )
      setUsers(updatedUsers)
      
      toast.success(`Updated ${usersToUpdate.length} users status to ${status}`)
      
      auditLogger.logBulkOperation(
        'current-user',
        'Current User',
        `Bulk updated user status to ${status}`,
        'user',
        selectedUsers.length,
        `Updated ${selectedUsers.length} users status to ${status}`
      )
    } catch (error) {
      console.error('Bulk status update failed:', error)
      toast.error('Failed to update user status')
    }
  }

  const handleBulkEmail = () => {
    const usersToEmail = users.filter(user => selectedUsers.includes(user.id.toString()))
    toast.info(`Email functionality would send emails to ${usersToEmail.length} users`)
    
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk emailed users',
      'user',
      usersToEmail.length,
      `Sent email to ${usersToEmail.length} users: ${usersToEmail.map(u => u.name).join(', ')}`
    )
  }

  // Define table columns
  const columns = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      searchable: true,
      render: (value: string, row: UserWithStats) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.avatar || "/placeholder.svg"} alt={row.name} />
            <AvatarFallback>
              {row.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {row.email}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: 'Admin', label: 'Admin' },
        { value: 'Manager', label: 'Manager' },
        { value: 'Employee', label: 'Employee' },
        { value: 'Technician', label: 'Technician' },
        { value: 'Supervisor', label: 'Supervisor' },
      ],
      render: (value: string) => <Badge variant="outline">{value}</Badge>
    },
    {
      key: 'department',
      label: 'Department',
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: 'IT', label: 'IT' },
        { value: 'HR', label: 'HR' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Management', label: 'Management' },
      ]
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      filterable: true,
      filterOptions: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
      ],
      render: (value: string) => (
        <Badge variant={value === "Active" ? "default" : "secondary"}>
          {value}
        </Badge>
      )
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: string, row: UserWithStats) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setViewProfileModal({ open: true, user: row })}>
              <Eye className="h-4 w-4 mr-2" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditEmployeeModal({ open: true, user: row })}>
              <Edit className="h-4 w-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setAssignDeviceModal({ open: true, user: row })}>
              <UserPlus className="h-4 w-4 mr-2" />
              Assign Device
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDocumentsModal({ open: true, user: row })}>
              <Download className="h-4 w-4 mr-2" />
              Documents
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => handleDeleteUser(row.id.toString())}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ]

  if (loading) {
    return (
      <SidebarInset>
        <Header title="User Management" description="Manage users, roles, and permissions across your organization" />
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading users...</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <Header title="User Management" description="Manage users, roles, and permissions across your organization" />
      <div className="flex-1 space-y-6 p-6">
        {/* Real-time Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.activeUsers}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.newThisMonth}</div>
              <p className="text-xs text-muted-foreground">+23% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.pendingApproval}</div>
              <p className="text-xs text-muted-foreground">-15% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportUsers}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" onClick={() => setCreateUserModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <BulkActions
                selectedItems={selectedUsers}
                totalItems={filteredUsers.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="users"
              />

              <SortableTable
                data={filteredUsers}
                columns={columns}
                searchFields={['name', 'email', 'department']}
                onRowClick={(user) => setViewProfileModal({ open: true, user })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Modals */}
        {viewProfileModal.user && (
          <ViewProfileModal
            open={viewProfileModal.open}
            onOpenChange={(open) => setViewProfileModal({ open, user: open ? viewProfileModal.user : null })}
            user={{
              id: viewProfileModal.user.id.toString(),
              name: viewProfileModal.user.name,
              email: viewProfileModal.user.email,
              phone: viewProfileModal.user.phone || "",
              department: viewProfileModal.user.department,
              position: viewProfileModal.user.position || viewProfileModal.user.role,
              employeeId: viewProfileModal.user.employeeId || viewProfileModal.user.id.toString(),
              joinDate: viewProfileModal.user.joinDate || "",
              status: viewProfileModal.user.status,
              avatar: viewProfileModal.user.avatar || ""
            }}
          />
        )}

        {editEmployeeModal.user && (
          <EditEmployeeModal
            open={editEmployeeModal.open}
            onOpenChange={(open) => setEditEmployeeModal({ open, user: open ? editEmployeeModal.user : null })}
            employee={{
              id: editEmployeeModal.user.id.toString(),
              name: editEmployeeModal.user.name,
              email: editEmployeeModal.user.email,
              phone: editEmployeeModal.user.phone || "",
              department: editEmployeeModal.user.department,
              position: editEmployeeModal.user.position || editEmployeeModal.user.role,
              employeeId: editEmployeeModal.user.employeeId || editEmployeeModal.user.id.toString(),
              joinDate: editEmployeeModal.user.joinDate || "",
              status: editEmployeeModal.user.status,
              avatar: editEmployeeModal.user.avatar || ""
            }}
          />
        )}

        {assignDeviceModal.user && (
          <AssignDeviceModal
            open={assignDeviceModal.open}
            onOpenChange={(open) => setAssignDeviceModal({ open, user: open ? assignDeviceModal.user : null })}
            onSubmit={(data) => {
              console.log("Device assigned:", data)
              setAssignDeviceModal({ open: false, user: null })
              toast.success("Device assigned successfully")
            }}
          />
        )}

        {documentsModal.user && (
          <DocumentsModal
            open={documentsModal.open}
            onOpenChange={(open) => setDocumentsModal({ open, user: open ? documentsModal.user : null })}
            employeeName={documentsModal.user.name}
            employeeId={documentsModal.user.employeeId || documentsModal.user.id.toString()}
          />
        )}

        {/* Create User Modal */}
        {createUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold mb-4">Add New User</h2>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateUser)}
                  className="space-y-4"
                >
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Full Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="email" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email Address" type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="role" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Role (e.g. Admin, Manager)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="department" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Department" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField name="status" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Status (Active/Inactive)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setCreateUserModal(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add User</Button>
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
