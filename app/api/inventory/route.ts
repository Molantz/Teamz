import { NextRequest, NextResponse } from 'next/server'

// Mock inventory data
let inventoryItems = [
  {
    id: "INV-001",
    name: "Dell Latitude 7420",
    category: "Laptops",
    quantity: 45,
    available: 12,
    assigned: 33,
    status: "In Stock",
    location: "Warehouse A",
    cost: "$1,200",
    supplier: "Dell Inc.",
  },
  {
    id: "INV-002",
    name: "HP LaserJet Pro",
    category: "Printers",
    quantity: 8,
    available: 2,
    assigned: 6,
    status: "Low Stock",
    location: "Office Floor 2",
    cost: "$450",
    supplier: "HP Inc.",
  },
  {
    id: "INV-003",
    name: "iPhone 14 Pro",
    category: "Mobile Devices",
    quantity: 25,
    available: 8,
    assigned: 17,
    status: "In Stock",
    location: "Secure Storage",
    cost: "$999",
    supplier: "Apple Inc.",
  },
  {
    id: "INV-004",
    name: "Dell PowerEdge R740",
    category: "Servers",
    quantity: 3,
    available: 0,
    assigned: 3,
    status: "Out of Stock",
    location: "Data Center",
    cost: "$4,500",
    supplier: "Dell Inc.",
  },
  {
    id: "INV-005",
    name: "Printer Toner Cartridges",
    category: "Consumables",
    quantity: 150,
    available: 45,
    assigned: 105,
    status: "In Stock",
    location: "Supply Room",
    cost: "$85",
    supplier: "HP Inc.",
  },
  {
    id: "INV-006",
    name: "Network Cables (Cat6)",
    category: "Consumables",
    quantity: 500,
    available: 200,
    assigned: 300,
    status: "In Stock",
    location: "Network Storage",
    cost: "$12",
    supplier: "CableCo",
  },
  {
    id: "INV-007",
    name: "Microsoft Office 365",
    category: "Software",
    quantity: 500,
    available: 50,
    assigned: 450,
    status: "In Stock",
    location: "Digital License",
    cost: "$15/month",
    supplier: "Microsoft",
  },
  {
    id: "INV-008",
    name: "Adobe Creative Suite",
    category: "Software",
    quantity: 25,
    available: 5,
    assigned: 20,
    status: "Low Stock",
    location: "Digital License",
    cost: "$52/month",
    supplier: "Adobe",
  },
  {
    id: "INV-009",
    name: "Cloud Backup Service",
    category: "Services",
    quantity: 1,
    available: 1,
    assigned: 0,
    status: "Active",
    location: "Cloud",
    cost: "$2,500/month",
    supplier: "AWS",
  },
  {
    id: "INV-010",
    name: "IT Support Contract",
    category: "Services",
    quantity: 1,
    available: 1,
    assigned: 0,
    status: "Active",
    location: "External",
    cost: "$5,000/month",
    supplier: "TechSupport Pro",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let filteredItems = [...inventoryItems]

    // Filter by category
    if (category) {
      filteredItems = filteredItems.filter(item => item.category === category)
    }

    // Filter by status
    if (status) {
      filteredItems = filteredItems.filter(item => item.status === status)
    }

    // Search functionality
    if (search) {
      filteredItems = filteredItems.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.supplier.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())
      )
    }

    return NextResponse.json(filteredItems)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch inventory items' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate a new ID
    const newId = `INV-${String(inventoryItems.length + 1).padStart(3, '0')}`
    
    const newItem = {
      id: newId,
      name: body.name,
      category: body.category,
      quantity: body.quantity,
      available: body.quantity, // Initially all available
      assigned: 0,
      status: "In Stock",
      location: body.location,
      cost: body.cost,
      supplier: body.supplier,
      description: body.description,
      serialNumber: body.serialNumber,
      warrantyExpiry: body.warrantyExpiry,
      licenseKey: body.licenseKey,
      serviceLevel: body.serviceLevel,
      contractEndDate: body.contractEndDate,
    }

    inventoryItems.push(newItem)

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
} 