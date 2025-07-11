import { NextRequest, NextResponse } from 'next/server'

let projects = [
  {
    id: 1,
    name: 'Network Infrastructure Upgrade',
    description: 'Upgrade core network infrastructure to support increased bandwidth',
    status: 'Ongoing',
    priority: 'High',
    progress: 65,
    budget: '$125,000',
    spent: '$81,250',
    startDate: '2024-01-15',
    endDate: '2024-03-15',
    manager: { name: 'John Smith', avatar: '/placeholder.svg?height=32&width=32' },
    teamSize: 5,
    tasksCompleted: 13,
    totalTasks: 20,
  },
  // ... add more mock projects as needed
]

export async function GET() {
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const newProject = { ...data, id: projects.length + 1 }
  projects.push(newProject)
  return NextResponse.json(newProject, { status: 201 })
} 