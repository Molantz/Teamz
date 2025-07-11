import { NextRequest, NextResponse } from 'next/server'

let users = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'Admin',
    department: 'IT',
    status: 'Active',
    lastLogin: '2 hours ago',
    avatar: '/placeholder.svg?height=32&width=32',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-01-15',
    employeeId: 'EMP001',
  },
  // ... add more mock users as needed
]

export async function GET() {
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newUser = { ...data, id: users.length + 1 }
  users.push(newUser)
  return NextResponse.json(newUser, { status: 201 })
} 