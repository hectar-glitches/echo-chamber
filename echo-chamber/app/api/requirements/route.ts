import { NextResponse } from "next/server"

// Mock database for demonstration purposes
// In a real application, this would be replaced with a database connection
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

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const category = searchParams.get("category")

  // Filter requirements based on query parameters
  let filteredRequirements = [...requirementsDB]

  if (status && status !== "all") {
    filteredRequirements = filteredRequirements.filter((req) => req.status.toLowerCase() === status.toLowerCase())
  }

  if (category && category !== "all") {
    filteredRequirements = filteredRequirements.filter((req) => req.category.toLowerCase() === category.toLowerCase())
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    requirements: filteredRequirements,
    total: filteredRequirements.length,
  })
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category || !data.description || !data.priority || !data.dataSource) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create new requirement
    const newRequirement = {
      id: `REQ-${String(requirementsDB.length + 1).padStart(3, "0")}`,
      title: data.title,
      category: data.category,
      description: data.description,
      submittedBy: data.submittedBy || "Current User", // In a real app, this would come from auth
      submittedDate: new Date().toISOString().split("T")[0],
      status: "Pending",
      priority: data.priority,
      dataSource: data.dataSource,
    }

    // Add to mock database
    requirementsDB.unshift(newRequirement)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      requirement: newRequirement,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create requirement" }, { status: 500 })
  }
}
