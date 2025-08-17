import { NextResponse } from "next/server"

export async function GET() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400))

  // Mock dashboard statistics
  const stats = {
    totalRequirements: 1248,
    pendingApproval: 42,
    complianceRate: 94.2,
    activeDataSources: 36,
    monthlyTrend: {
      totalGrowth: "+12.5%",
      pendingChange: "-8%",
      complianceChange: "+2.1%",
      dataSourcesChange: "+3",
    },
    chartData: {
      monthly: [
        { name: "Jan", submitted: 65, approved: 58 },
        { name: "Feb", submitted: 78, approved: 70 },
        { name: "Mar", submitted: 90, approved: 85 },
        { name: "Apr", submitted: 81, approved: 75 },
        { name: "May", submitted: 86, approved: 80 },
        { name: "Jun", submitted: 95, approved: 90 },
      ],
      categories: [
        { name: "Market Data", value: 35 },
        { name: "Regulatory", value: 25 },
        { name: "Compliance", value: 20 },
        { name: "Analytics", value: 15 },
        { name: "Other", value: 5 },
      ],
    },
  }

  return NextResponse.json(stats)
}
