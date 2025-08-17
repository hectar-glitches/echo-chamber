import { NextResponse } from "next/server"

// Mock market data
const marketData = [
  { symbol: "NIFTY 50", price: 24568.75, change: 125.45, changePercent: 0.51 },
  { symbol: "SENSEX", price: 80642.15, change: 412.25, changePercent: 0.52 },
  { symbol: "BANKNIFTY", price: 52345.6, change: -78.3, changePercent: -0.15 },
  { symbol: "HDFC BANK", price: 1678.25, change: 12.75, changePercent: 0.76 },
  { symbol: "RELIANCE", price: 2945.8, change: -18.5, changePercent: -0.62 },
  { symbol: "TCS", price: 3856.45, change: 42.3, changePercent: 1.11 },
  { symbol: "INFOSYS", price: 1542.7, change: 15.8, changePercent: 1.03 },
  { symbol: "ICICI BANK", price: 1124.35, change: 8.45, changePercent: 0.76 },
  { symbol: "BHARTI AIRTEL", price: 1432.6, change: -5.7, changePercent: -0.4 },
  { symbol: "HUL", price: 2765.9, change: 22.4, changePercent: 0.82 },
]

export async function GET() {
  // Generate slightly randomized market data to simulate live updates
  const updatedMarketData = marketData.map((stock) => {
    const randomChange = (Math.random() - 0.5) * 5
    const newPrice = Math.max(stock.price + randomChange, 0.01)
    const change = Number.parseFloat((newPrice - stock.price + stock.change).toFixed(2))
    const changePercent = Number.parseFloat(((change / (stock.price - stock.change)) * 100).toFixed(2))

    return {
      ...stock,
      price: Number.parseFloat(newPrice.toFixed(2)),
      change,
      changePercent,
    }
  })

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(updatedMarketData)
}
