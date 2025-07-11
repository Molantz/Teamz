import { NextRequest, NextResponse } from 'next/server'

let departments = [
  {
    id: 1,
    name: 'Information Technology',
    code: 'IT',
    manager: { name: 'John Smith', avatar: '/placeholder.svg?height=32&width=32' },
    employeeCount: 25,
    assignedDevices: 78,
    budget: '$125,000',
    location: 'Building A, Floor 3',
    description: 'Manages all IT infrastructure, support, and development',
  },
  // ... add more mock departments as needed
]

export async function GET() {
  return NextResponse.json(departments)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newDepartment = { ...data, id: departments.length + 1 }
  departments.push(newDepartment)
  return NextResponse.json(newDepartment, { status: 201 })
} 