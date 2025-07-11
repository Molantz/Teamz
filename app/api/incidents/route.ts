import { NextRequest, NextResponse } from 'next/server'

let incidents = [
  {
    id: 1,
    title: 'Network connectivity issues in Building A',
    description: 'Multiple users reporting intermittent network connectivity',
    status: 'In Progress',
    priority: 'High',
    category: 'Network',
    assignee: { name: 'John Smith', avatar: '/placeholder.svg?height=32&width=32' },
    reporter: 'Sarah Johnson',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-01-15T14:20:00Z',
    affectedUsers: 25,
  },
  // ... add more mock incidents as needed
]

export async function GET() {
  return NextResponse.json(incidents)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newIncident = { ...data, id: incidents.length + 1 }
  incidents.push(newIncident)
  return NextResponse.json(newIncident, { status: 201 })
} 