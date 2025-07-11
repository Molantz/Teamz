import { NextRequest, NextResponse } from 'next/server'

let requests = [
  {
    id: 1,
    title: 'New MacBook Pro for Development Team',
    description: 'Request for high-performance laptop for mobile app development',
    type: 'Hardware',
    status: 'Pending',
    priority: 'High',
    requester: { name: 'John Smith', avatar: '/placeholder.svg?height=32&width=32', department: 'Engineering' },
    estimatedCost: '$2,500',
    created: '2024-01-15T10:30:00Z',
    justification: 'Current laptop unable to handle iOS development workload',
  },
  // ... add more mock requests as needed
]

export async function GET() {
  return NextResponse.json(requests)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newRequest = { ...data, id: requests.length + 1 }
  requests.push(newRequest)
  return NextResponse.json(newRequest, { status: 201 })
} 