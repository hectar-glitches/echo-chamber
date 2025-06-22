"use client"

import { useState, useEffect } from "react"

export interface Requirement {
  id: string
  title: string
  category: string
  description?: string
  submittedBy: string
  submittedDate: string
  status: "Approved" | "Pending" | "Rejected"
  priority: "High" | "Medium" | "Low"
  dataSource: string
}

interface UseRequirementsOptions {
  status?: string
  category?: string
  initialData?: Requirement[]
}

export function useRequirements(options: UseRequirementsOptions = {}) {
  const [requirements, setRequirements] = useState<Requirement[]>(options.initialData || [])
  const [isLoading, setIsLoading] = useState<boolean>(!options.initialData)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number>(0)

  const fetchRequirements = async (status?: string, category?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (status && status !== "all") params.append("status", status)
      if (category && category !== "all") params.append("category", category)

      const response = await fetch(`/api/requirements?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error fetching requirements: ${response.statusText}`)
      }

      const data = await response.json()
      setRequirements(data.requirements)
      setTotalCount(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to fetch requirements:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const createRequirement = async (
    newRequirement: Omit<Requirement, "id" | "submittedBy" | "submittedDate" | "status">,
  ) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequirement),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create requirement")
      }

      const data = await response.json()

      // Update local state with the new requirement
      setRequirements((prev) => [data.requirement, ...prev])
      setTotalCount((prev) => prev + 1)

      return data.requirement
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to create requirement:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateRequirement = async (id: string, updates: Partial<Requirement>) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update requirement")
      }

      const data = await response.json()

      // Update local state with the updated requirement
      setRequirements((prev) => prev.map((req) => (req.id === id ? data.requirement : req)))

      return data.requirement
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to update requirement:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const deleteRequirement = async (id: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/requirements/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete requirement")
      }

      // Update local state by removing the deleted requirement
      setRequirements((prev) => prev.filter((req) => req.id !== id))
      setTotalCount((prev) => prev - 1)

      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Failed to delete requirement:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch requirements on mount or when dependencies change
  useEffect(() => {
    if (!options.initialData) {
      fetchRequirements(options.status, options.category)
    }
  }, [options.status, options.category])

  return {
    requirements,
    isLoading,
    error,
    totalCount,
    fetchRequirements,
    createRequirement,
    updateRequirement,
    deleteRequirement,
  }
}
