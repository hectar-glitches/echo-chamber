"use client"

import { useState, useEffect } from "react"

export interface DashboardStats {
  totalRequirements: number
  pendingApproval: number
  complianceRate: number
  activeDataSources: number
  monthlyTrend: {
    totalGrowth: string
    pendingChange: string
    complianceChange: string
    dataSourcesChange: string
  }
  chartData: {
    monthly: Array<{
      name: string
      submitted: number
      approved: number
    }>
    categories: Array<{
      name: string
      value: number
    }>
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard-stats")

      if (!response.ok) {
        throw new Error(`Error fetching dashboard stats: ${response.statusText}`)
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to fetch dashboard stats:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch stats on mount
  useEffect(() => {
    fetchStats()

    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    stats,
    isLoading,
    error,
    refreshStats: fetchStats,
  }
}
