import { NextResponse } from "next/server"

// Using the same mock database from the main route
// In a real application, this would be imported from a shared database module
const requirementsDB = [
  {
    id: "REQ-001",
    title: "Daily Market Summary Data",
    category: "Market Data",
    description: "Daily summary of market activities including volume, value, and number of trades.",
    submittedBy: "John Smith",
    submittedDate: "2025-06-18",
    status: "Approved",
    priority: "High",
    dataSource: "NSE Direct Feed",
  },
  {
    id: "REQ-002",
    title: "Quarterly Compliance Report",
    category: "Compliance",
    description: "Quarterly report on compliance with NSE regulations and guidelines.",
    submittedBy: "Sarah Johnson",
    submittedDate: "2025-06-17",
    status: "Pending",
    priority: "Medium",
    dataSource: "Compliance Portal",
  },
  {
    id: "REQ-003",
    title: "Regulatory Disclosure Data",
    category: "Regulatory",
    description: "Data required for regulatory disclosures to SEBI and other authorities.",
    submittedBy: "Michael Chen",
    submittedDate: "2025-06-15",
    status: "Rejected",
    priority: "High",
    dataSource: "Regulatory Database",
  },
  {
    id: "REQ-004",
    title: "Trading Volume Analytics",
    category: "Analytics",
    description: "Detailed analytics on trading volumes across different segments.",
    submittedBy: "Priya Patel",
    submittedDate: "2025-06-14",
    status: "Approved",
    priority: "Low",
    dataSource: "Analytics Platform",
  },
  {
    id: "REQ-005",
    title: "Market Maker Performance Data",
    category: "Market Data",
    description: "Performance metrics for market makers including spread and liquidity provision.",
    submittedBy: "Alex Rodriguez",
    submittedDate: "2025-06-12",
    status: "Pending",
    priority: "Medium",
    dataSource: "Market Operations",
  },
]

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the requirement by ID
  const requirement = requirementsDB.find((req) => req.id === id)

  if (!requirement) {
    return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(requirement)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()

    // Find the requirement index
    const index = requirementsDB.findIndex((req) => req.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
    }

    // Update the requirement
    const updatedRequirement = {
      ...requirementsDB[index],
      ...data,
      // Don't allow changing these fields
      id: requirementsDB[index].id,
      submittedBy: requirementsDB[index].submittedBy,
      submittedDate: requirementsDB[index].submittedDate,
    }

    requirementsDB[index] = updatedRequirement

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      requirement: updatedRequirement,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update requirement" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = params.id

  // Find the requirement index
  const index = requirementsDB.findIndex((req) => req.id === id)

  if (index === -1) {
    return NextResponse.json({ error: "Requirement not found" }, { status: 404 })
  }

  // Remove the requirement
  requirementsDB.splice(index, 1)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    message: "Requirement deleted successfully",
  })
}
