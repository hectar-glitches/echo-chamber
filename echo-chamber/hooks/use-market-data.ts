"use client"

import { useState, useEffect } from "react"

export interface StockData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function useMarketData() {
  const [stocks, setStocks] = useState<StockData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/market-data")

      if (!response.ok) {
        throw new Error(`Error fetching market data: ${response.statusText}`)
      }

      const data = await response.json()
      setStocks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to fetch market data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch market data on mount
  useEffect(() => {
    fetchMarketData()

    // Refresh market data every 10 seconds
    const interval = setInterval(fetchMarketData, 10000)

    return () => clearInterval(interval)
  }, [])

  return {
    stocks,
    isLoading,
    error,
    refreshMarketData: fetchMarketData,
  }
}
