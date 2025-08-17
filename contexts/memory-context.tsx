"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

export interface Memory {
  id: string
  title: string
  content: string
  type: "thought" | "dream" | "idea" | "experience" | "reflection"
  tags: string[]
  emotion: "joy" | "sadness" | "excitement" | "calm" | "curiosity" | "nostalgia"
  createdAt: Date
  aiSummary?: string
  aiCharacter?: Character
  position: [number, number, number]
  connections: string[]
}

export interface Character {
  id: string
  name: string
  personality: string
  appearance: {
    color: string
    shape: "crystal" | "orb" | "tree" | "flower" | "star" | "book"
    size: number
  }
  dialogue: string[]
  memoryId: string
}

interface MemoryContextType {
  memories: Memory[]
  characters: Character[]
  selectedMemory: Memory | null
  isProcessing: boolean
  addMemory: (memory: Omit<Memory, "id" | "createdAt" | "position" | "connections">) => Promise<void>
  selectMemory: (id: string) => void
  getMemoryConnections: (id: string) => Memory[]
  searchMemories: (query: string) => Memory[]
  getMemoriesByTag: (tag: string) => Memory[]
  getMemoriesByEmotion: (emotion: Memory["emotion"]) => Memory[]
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined)

export function MemoryProvider({ children }: { children: React.ReactNode }) {
  const [memories, setMemories] = useState<Memory[]>([
    {
      id: "1",
      title: "Morning Coffee Revelation",
      content:
        "Had this amazing insight about life while drinking coffee on the balcony. The way the steam rose reminded me of thoughts forming...",
      type: "thought",
      tags: ["coffee", "morning", "insight", "metaphor"],
      emotion: "calm",
      createdAt: new Date("2024-01-15"),
      aiSummary:
        "A peaceful morning moment that sparked a metaphorical connection between coffee steam and the formation of thoughts.",
      position: [2, 1, 3],
      connections: ["2", "5"],
      aiCharacter: {
        id: "char-1",
        name: "Misty the Contemplator",
        personality: "Wise and serene, speaks in gentle metaphors about the beauty of everyday moments",
        appearance: { color: "#8B4513", shape: "orb", size: 1.2 },
        dialogue: [
          "Like steam rising from your cup, thoughts emerge from the depths of consciousness...",
          "In the quiet morning hours, wisdom whispers its secrets.",
          "Every sip holds a story, every moment a lesson.",
        ],
        memoryId: "1",
      },
    },
    {
      id: "2",
      title: "Childhood Dream of Flying",
      content:
        "Recurring dream from childhood where I could fly by flapping my arms. The feeling of freedom was incredible...",
      type: "dream",
      tags: ["childhood", "flying", "freedom", "recurring"],
      emotion: "joy",
      createdAt: new Date("2024-01-10"),
      aiSummary: "A cherished childhood dream representing the desire for freedom and transcendence of limitations.",
      position: [-1, 2, 1],
      connections: ["1", "3"],
      aiCharacter: {
        id: "char-2",
        name: "Skyweaver",
        personality: "Playful and adventurous, embodies the spirit of childhood wonder and limitless possibilities",
        appearance: { color: "#87CEEB", shape: "star", size: 1.5 },
        dialogue: [
          "Remember when the sky was not a limit but a playground?",
          "Your dreams taught you that boundaries exist only in the waking world.",
          "Spread your wings, dear dreamer, for the sky remembers you.",
        ],
        memoryId: "2",
      },
    },
    {
      id: "3",
      title: "The Idea for a Time Garden",
      content:
        "What if we could plant moments in time like seeds, and watch them grow into full experiences we could revisit?",
      type: "idea",
      tags: ["time", "garden", "innovation", "metaphor"],
      emotion: "excitement",
      createdAt: new Date("2024-01-20"),
      aiSummary: "An innovative concept merging temporal mechanics with botanical metaphors for memory preservation.",
      position: [0, 1.5, -2],
      connections: ["2", "4"],
      aiCharacter: {
        id: "char-3",
        name: "Chronos Bloom",
        personality: "Innovative and mystical, speaks about time as a living, growing entity that can be cultivated",
        appearance: { color: "#9370DB", shape: "flower", size: 1.3 },
        dialogue: [
          "Time is not linear, dear gardener, but grows in spirals like a vine.",
          "Plant your moments carefully, for they will bloom when you need them most.",
          "In the garden of memory, every season brings new growth.",
        ],
        memoryId: "3",
      },
    },
  ])

  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const generatePosition = useCallback((): [number, number, number] => {
    const angle = Math.random() * Math.PI * 2
    const radius = 2 + Math.random() * 4
    const height = 0.5 + Math.random() * 2
    return [Math.cos(angle) * radius, height, Math.sin(angle) * radius]
  }, [])

  const addMemory = useCallback(
    async (memoryData: Omit<Memory, "id" | "createdAt" | "position" | "connections">) => {
      setIsProcessing(true)

      // Simulate AI processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newMemory: Memory = {
        ...memoryData,
        id: Date.now().toString(),
        createdAt: new Date(),
        position: generatePosition(),
        connections: [],
      }

      setMemories((prev) => [...prev, newMemory])
      setIsProcessing(false)
    },
    [generatePosition],
  )

  const selectMemory = useCallback(
    (id: string) => {
      const memory = memories.find((m) => m.id === id)
      setSelectedMemory(memory || null)
    },
    [memories],
  )

  const getMemoryConnections = useCallback(
    (id: string) => {
      const memory = memories.find((m) => m.id === id)
      if (!memory) return []

      return memories.filter((m) => memory.connections.includes(m.id))
    },
    [memories],
  )

  const searchMemories = useCallback(
    (query: string) => {
      const lowercaseQuery = query.toLowerCase()
      return memories.filter(
        (memory) =>
          memory.title.toLowerCase().includes(lowercaseQuery) ||
          memory.content.toLowerCase().includes(lowercaseQuery) ||
          memory.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
      )
    },
    [memories],
  )

  const getMemoriesByTag = useCallback(
    (tag: string) => {
      return memories.filter((memory) => memory.tags.includes(tag))
    },
    [memories],
  )

  const getMemoriesByEmotion = useCallback(
    (emotion: Memory["emotion"]) => {
      return memories.filter((memory) => memory.emotion === emotion)
    },
    [memories],
  )

  // Update characters when memories change
  React.useEffect(() => {
    const memoryCharacters = memories.filter((memory) => memory.aiCharacter).map((memory) => memory.aiCharacter!)
    setCharacters(memoryCharacters)
  }, [memories])

  return (
    <MemoryContext.Provider
      value={{
        memories,
        characters,
        selectedMemory,
        isProcessing,
        addMemory,
        selectMemory,
        getMemoryConnections,
        searchMemories,
        getMemoriesByTag,
        getMemoriesByEmotion,
      }}
    >
      {children}
    </MemoryContext.Provider>
  )
}

export function useMemory() {
  const context = useContext(MemoryContext)
  if (context === undefined) {
    throw new Error("useMemory must be used within a MemoryProvider")
  }
  return context
}
