"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarInset } from "@/components/ui/sidebar"
import { Building2, Filter, MoreHorizontal, Plus, Search, Users, Laptop, DollarSign } from "lucide-react"

const departments = [
  {
    id: "DEPT-001",
    name: "Information Technology",
    code: "IT",
    manager: {
      name: "John Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    employeeCount: 25,
    assignedDevices: 78,
    budget: "$125,000",
    location: "Building A, Floor 3",
    description: "Manages all IT infrastructure, support, and development",
  },
  {
    id: "DEPT-002",
    name: "Human Resources",
    code: "HR",
    manager: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    employeeCount: 12,
    assignedDevices: 24,
    budget: "$45,000",
    location: "Building A, Floor 2",
    description: "Employee relations, recruitment, and organizational development",
  },
  {
    id: "DEPT-003",
    name: "Engineering",
    code: "ENG",
    manager: {
      name: "Mike Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    employeeCount: 45,
    assignedDevices: 135,
    budget: "$200,000",
    location: "Building B, Floor 1-2",
    description: "Product development, software engineering, and technical innovation",
  },
  {
    id: "DEPT-004",
    name: "Marketing",
    code: "MKT",
    manager: {
      name: "Emily Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    employeeCount: 18,
    assignedDevices: 36,
    budget: "$75,000",
    location: "Building A, Floor 1",
    description: "Brand management, digital marketing, and customer engagement",
  },
]

const departmentStats = [
  { label: "Total Departments", value: "12", change: "+1" },
  { label: "Total Employees", value: "247", change: "+15" },
  { label: "Total IT Budget", value: "$2.1M", change: "+8%" },
  { label: "Devices Assigned", value: "892", change: "+23" },
]

export default function DepartmentsPage() {
  return (
    <SidebarInset>
      <Header title="Department Management" description="Manage departments, budgets, and organizational structure" />
      <div className="flex-1 space-y-6 p-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {departmentStats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                <Building2 className="h-4 w-4 text-blue-600" />
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
                  <Input placeholder="Search departments..." className="w-[250px] pl-8" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Department
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((department) => (
                  <TableRow key={department.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{department.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {department.code} • {department.id}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={department.manager.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {department.manager.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{department.manager.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{department.employeeCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Laptop className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{department.assignedDevices}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm font-medium">{department.budget}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{department.location}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Department</DropdownMenuItem>
                          <DropdownMenuItem>Manage Employees</DropdownMenuItem>
                          <DropdownMenuItem>View Budget</DropdownMenuItem>
                          <DropdownMenuItem>Assign Devices</DropdownMenuItem>
                          <DropdownMenuItem>Generate Report</DropdownMenuItem>
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
