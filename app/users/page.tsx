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
import { Filter, MoreHorizontal, Search, UserPlus, Mail } from "lucide-react"

import { ViewProfileModal } from "@/components/modals/view-profile-modal"
import { EditEmployeeModal } from "@/components/modals/edit-employee-modal"
import { AssignDeviceModal } from "@/components/modals/assign-device-modal"
import { DocumentsModal } from "@/components/modals/documents-modal"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { SortableTable } from '@/components/sortable-table'
import { BulkActions } from '@/components/bulk-actions'
import { auditLogger } from '@/lib/audit-log'

import { usersApi } from "@/lib/api"
import { useEffect, useState } from "react"

interface User {
  id: number
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
}

const userStats = [
  { label: "Total Users", value: "1,247", change: "+12%" },
  { label: "Active Users", value: "1,156", change: "+8%" },
  { label: "New This Month", value: "47", change: "+23%" },
  { label: "Pending Approval", value: "8", change: "-15%" },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [viewProfileModal, setViewProfileModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [editEmployeeModal, setEditEmployeeModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [assignDeviceModal, setAssignDeviceModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [documentsModal, setDocumentsModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null })
  const [createUserModal, setCreateUserModal] = useState(false)
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "Employee",
      department: "",
      status: "Active",
    },
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await usersApi.getAll()
        setUsers(data)
      } catch (error) {
        console.error('Failed to fetch users:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleCreateUser = async (formData: any) => {
    try {
      const newUser = await usersApi.create(formData)
      setUsers([...users, newUser])
      setCreateUserModal(false)
      form.reset()
      
      // Log the action
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
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id.toString()))
    } else {
      setSelectedUsers([])
    }
  }

  const handleBulkDelete = () => {
    const usersToDelete = users.filter(user => selectedUsers.includes(user.id.toString()))
    setUsers(users.filter(user => !selectedUsers.includes(user.id.toString())))
    setSelectedUsers([])
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk deleted users',
      'user',
      usersToDelete.length,
      `Deleted ${usersToDelete.length} users: ${usersToDelete.map(u => u.name).join(', ')}`
    )
  }

  const handleBulkExport = () => {
    const usersToExport = users.filter(user => selectedUsers.includes(user.id.toString()))
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      'Bulk exported users',
      'user',
      usersToExport.length,
      `Exported ${usersToExport.length} users: ${usersToExport.map(u => u.name).join(', ')}`
    )
  }

  const handleBulkStatusUpdate = (status: string) => {
    const updatedUsers = users.map(user => 
      selectedUsers.includes(user.id.toString()) 
        ? { ...user, status } 
        : user
    )
    setUsers(updatedUsers)
    
    // Log the bulk operation
    auditLogger.logBulkOperation(
      'current-user',
      'Current User',
      `Bulk updated user status to ${status}`,
      'user',
      selectedUsers.length,
      `Updated ${selectedUsers.length} users status to ${status}`
    )
  }

  const handleBulkEmail = () => {
    const usersToEmail = users.filter(user => selectedUsers.includes(user.id.toString()))
    
    // Log the bulk operation
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
      render: (value: string, row: User) => (
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
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {userStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </div>
              <Button size="sm" onClick={() => setCreateUserModal(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <BulkActions
                selectedItems={selectedUsers}
                totalItems={users.length}
                onSelectAll={handleSelectAll}
                onBulkDelete={handleBulkDelete}
                onBulkExport={handleBulkExport}
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onBulkEmail={handleBulkEmail}
                entityType="users"
              />
              <SortableTable
                data={users}
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
