import { NextRequest, NextResponse } from 'next/server'

let devices = [
  {
    id: 1,
    name: 'Dell Latitude 7420',
    type: 'Laptop',
    serialNumber: 'DL7420-001-2024',
    assignedTo: { name: 'John Smith', avatar: '/placeholder.svg?height=32&width=32' },
    department: 'IT',
    status: 'Active',
    condition: 'Excellent',
    purchaseDate: '2024-01-15',
    warrantyExpiry: '2027-01-15',
    lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-03-01',
  },
  // ... add more mock devices as needed
]

export async function GET() {
  return NextResponse.json(devices)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newDevice = { ...data, id: devices.length + 1 }
  devices.push(newDevice)
  return NextResponse.json(newDevice, { status: 201 })
} 