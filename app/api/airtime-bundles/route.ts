import { NextRequest, NextResponse } from 'next/server'

// Mock airtime bundle data
let airtimeBundles = [
  {
    id: "BUN-001",
    name: "Corporate Data Plan",
    type: "Data Only",
    provider: "MTN",
    dataLimit: "10GB",
    dataUsed: "7.2GB",
    voiceMinutes: 0,
    voiceUsed: 0,
    validity: "30 days",
    cost: "$25/month",
    status: "Active",
    assignedTo: "John Smith",
    phoneNumber: "+2348012345678",
    expiryDate: "2024-02-15",
    autoRenew: true,
  },
  {
    id: "BUN-002",
    name: "Executive Voice+Data",
    type: "Voice + Data",
    provider: "Airtel",
    dataLimit: "15GB",
    dataUsed: "12.8GB",
    voiceMinutes: 1000,
    voiceUsed: 450,
    validity: "30 days",
    cost: "$45/month",
    status: "Active",
    assignedTo: "Sarah Johnson",
    phoneNumber: "+2348098765432",
    expiryDate: "2024-02-20",
    autoRenew: true,
  },
  {
    id: "BUN-003",
    name: "Unlimited Corporate",
    type: "Unlimited",
    provider: "Glo",
    dataLimit: "Unlimited",
    dataUsed: "25.6GB",
    voiceMinutes: "Unlimited",
    voiceUsed: 1200,
    validity: "30 days",
    cost: "$75/month",
    status: "Active",
    assignedTo: "Mike Wilson",
    phoneNumber: "+2348055555555",
    expiryDate: "2024-02-25",
    autoRenew: true,
  },
  {
    id: "BUN-004",
    name: "International Roaming",
    type: "International",
    provider: "MTN",
    dataLimit: "5GB",
    dataUsed: "2.1GB",
    voiceMinutes: 500,
    voiceUsed: 180,
    validity: "15 days",
    cost: "$120/month",
    status: "Active",
    assignedTo: "Lisa Brown",
    phoneNumber: "+2348077777777",
    expiryDate: "2024-02-10",
    autoRenew: false,
  },
  {
    id: "BUN-005",
    name: "Basic Data Plan",
    type: "Data Only",
    provider: "9mobile",
    dataLimit: "5GB",
    dataUsed: "4.9GB",
    voiceMinutes: 0,
    voiceUsed: 0,
    validity: "30 days",
    cost: "$15/month",
    status: "Low Data",
    assignedTo: "Tom Davis",
    phoneNumber: "+2348066666666",
    expiryDate: "2024-02-18",
    autoRenew: true,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const provider = searchParams.get('provider')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredBundles = [...airtimeBundles]

    // Filter by type
    if (type) {
      filteredBundles = filteredBundles.filter(bundle => bundle.type === type)
    }

    // Filter by provider
    if (provider) {
      filteredBundles = filteredBundles.filter(bundle => bundle.provider === provider)
    }

    // Filter by status
    if (status) {
      filteredBundles = filteredBundles.filter(bundle => bundle.status === status)
    }

    // Search functionality
    if (search) {
      filteredBundles = filteredBundles.filter(bundle =>
        bundle.name.toLowerCase().includes(search.toLowerCase()) ||
        bundle.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
        bundle.phoneNumber.includes(search)
      )
    }

    return NextResponse.json(filteredBundles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch airtime bundles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate a new ID
    const newId = `BUN-${String(airtimeBundles.length + 1).padStart(3, '0')}`
    
    const newBundle = {
      id: newId,
      name: body.name,
      type: body.type,
      provider: body.provider,
      dataLimit: body.dataLimit,
      dataUsed: "0GB",
      voiceMinutes: body.voiceMinutes,
      voiceUsed: 0,
      validity: body.validity,
      cost: body.cost,
      status: "Active",
      assignedTo: body.assignedTo,
      phoneNumber: body.phoneNumber,
      expiryDate: body.expiryDate,
      autoRenew: body.autoRenew,
      description: body.description,
      internationalRoaming: body.internationalRoaming,
      smsLimit: body.smsLimit,
      mmsLimit: body.mmsLimit,
    }

    airtimeBundles.push(newBundle)

    return NextResponse.json(newBundle, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create airtime bundle' },
      { status: 500 }
    )
  }
} 