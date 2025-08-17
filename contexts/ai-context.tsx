"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { Memory, Character } from "@/contexts/memory-context"

interface AIInsight {
  id: string
  type: "connection" | "pattern" | "theme" | "suggestion"
  title: string
  description: string
  relatedMemories: string[]
  confidence: number
  createdAt: Date
}

interface AIContextType {
  insights: AIInsight[]
  isAnalyzing: boolean
  processMemory: (
    content: string,
    type: Memory["type"],
  ) => Promise<{
    summary: string
    tags: string[]
    emotion: Memory["emotion"]
    character: Character
  }>
  generateInsights: () => Promise<void>
  getMemoryConnections: (memoryId: string) => string[]
}

const AIContext = createContext<AIContextType | undefined>(undefined)

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: "insight-1",
      type: "pattern",
      title: "Morning Reflection Pattern",
      description:
        "You tend to have your most profound thoughts during morning hours, often triggered by simple daily rituals.",
      relatedMemories: ["1"],
      confidence: 0.85,
      createdAt: new Date("2024-01-21"),
    },
    {
      id: "insight-2",
      type: "connection",
      title: "Freedom & Transcendence Theme",
      description:
        "Your memories show a recurring theme of seeking freedom and transcending limitations, from childhood dreams to innovative ideas.",
      relatedMemories: ["2", "3"],
      confidence: 0.92,
      createdAt: new Date("2024-01-22"),
    },
  ])

  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const generateCharacterName = useCallback((content: string, emotion: Memory["emotion"]) => {
    const namePatterns = {
      joy: ["Sunny", "Sparkle", "Gleam", "Radiant", "Bliss"],
      sadness: ["Misty", "Echo", "Shade", "Whisper", "Melancholy"],
      excitement: ["Zap", "Burst", "Flash", "Dynamo", "Spark"],
      calm: ["Serene", "Gentle", "Peaceful", "Tranquil", "Zen"],
      curiosity: ["Quest", "Wonder", "Seek", "Explore", "Discover"],
      nostalgia: ["Memory", "Echo", "Vintage", "Reminisce", "Keeper"],
    }

    const suffixes = ["weaver", "keeper", "guardian", "whisper", "bloom", "sage", "spirit"]

    const names = namePatterns[emotion]
    const name = names[Math.floor(Math.random() * names.length)]
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]

    return `${name} the ${suffix.charAt(0).toUpperCase() + suffix.slice(1)}`
  }, [])

  const generateCharacterAppearance = useCallback((emotion: Memory["emotion"], type: Memory["type"]) => {
    const emotionColors = {
      joy: "#FFD700",
      sadness: "#4682B4",
      excitement: "#FF6347",
      calm: "#98FB98",
      curiosity: "#DDA0DD",
      nostalgia: "#F4A460",
    }

    const typeShapes: Record<Memory["type"], Character["appearance"]["shape"]> = {
      thought: "orb",
      dream: "star",
      idea: "crystal",
      experience: "tree",
      reflection: "flower",
    }

    return {
      color: emotionColors[emotion],
      shape: typeShapes[type],
      size: 1 + Math.random() * 0.5,
    }
  }, [])

  const generatePersonality = useCallback((content: string, emotion: Memory["emotion"], type: Memory["type"]) => {
    const personalityTraits = {
      joy: ["cheerful", "optimistic", "energetic", "inspiring"],
      sadness: ["contemplative", "deep", "empathetic", "gentle"],
      excitement: ["enthusiastic", "dynamic", "passionate", "bold"],
      calm: ["serene", "wise", "peaceful", "grounding"],
      curiosity: ["inquisitive", "adventurous", "clever", "playful"],
      nostalgia: ["sentimental", "storytelling", "warm", "reflective"],
    }

    const traits = personalityTraits[emotion]
    const selectedTraits = traits.slice(0, 2 + Math.floor(Math.random() * 2))

    return `${selectedTraits.join(", ")} character who embodies the essence of your ${type} about ${content.slice(0, 30)}...`
  }, [])

  const generateDialogue = useCallback((content: string, personality: string) => {
    // Simulate AI-generated dialogue based on content and personality
    const dialogueTemplates = [
      "I remember when you first thought about this...",
      "This reminds me of something deeper within you...",
      "Your mind created me from this beautiful moment...",
      "Let me share what I've learned from your memory...",
      "There's more to this story than meets the eye...",
    ]

    return dialogueTemplates.slice(0, 3).map((template) => template + " " + content.slice(0, 50) + "...")
  }, [])

  const processMemory = useCallback(
    async (content: string, type: Memory["type"]) => {
      setIsAnalyzing(true)

      // Simulate AI processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate AI summary
      const summary = `AI-generated summary: ${content.slice(0, 100)}...`

      // Extract/generate tags
      const commonWords = content.toLowerCase().match(/\b\w{4,}\b/g) || []
      const tags = [...new Set(commonWords.slice(0, 4))]

      // Determine emotion (simplified AI emotion detection)
      const emotionKeywords = {
        joy: ["happy", "excited", "wonderful", "amazing", "love"],
        sadness: ["sad", "lonely", "miss", "lost", "cry"],
        excitement: ["exciting", "thrilling", "incredible", "awesome", "wow"],
        calm: ["peaceful", "quiet", "serene", "gentle", "soft"],
        curiosity: ["wonder", "question", "explore", "discover", "why"],
        nostalgia: ["remember", "childhood", "past", "used", "old"],
      }

      let detectedEmotion: Memory["emotion"] = "calm"
      let maxMatches = 0

      Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
        const matches = keywords.filter((keyword) => content.toLowerCase().includes(keyword)).length

        if (matches > maxMatches) {
          maxMatches = matches
          detectedEmotion = emotion as Memory["emotion"]
        }
      })

      // Generate character
      const characterName = generateCharacterName(content, detectedEmotion)
      const appearance = generateCharacterAppearance(detectedEmotion, type)
      const personality = generatePersonality(content, detectedEmotion, type)
      const dialogue = generateDialogue(content, personality)

      const character: Character = {
        id: `char-${Date.now()}`,
        name: characterName,
        personality,
        appearance,
        dialogue,
        memoryId: "", // Will be set when memory is created
      }

      setIsAnalyzing(false)

      return {
        summary,
        tags,
        emotion: detectedEmotion,
        character,
      }
    },
    [generateCharacterName, generateCharacterAppearance, generatePersonality, generateDialogue],
  )

  const generateInsights = useCallback(async () => {
    setIsAnalyzing(true)

    // Simulate AI insight generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newInsight: AIInsight = {
      id: `insight-${Date.now()}`,
      type: "suggestion",
      title: "New Memory Pattern Detected",
      description: "Your recent memories suggest a growing interest in temporal concepts and metaphysical ideas.",
      relatedMemories: ["1", "2", "3"],
      confidence: 0.78,
      createdAt: new Date(),
    }

    setInsights((prev) => [newInsight, ...prev])
    setIsAnalyzing(false)
  }, [])

  const getMemoryConnections = useCallback(
    (memoryId: string) => {
      // Simulate AI-powered connection detection
      // In a real app, this would use semantic similarity, topic modeling, etc.
      return insights
        .filter((insight) => insight.relatedMemories.includes(memoryId))
        .flatMap((insight) => insight.relatedMemories)
        .filter((id) => id !== memoryId)
    },
    [insights],
  )

  return (
    <AIContext.Provider
      value={{
        insights,
        isAnalyzing,
        processMemory,
        generateInsights,
        getMemoryConnections,
      }}
    >
      {children}
    </AIContext.Provider>
  )
}

export function useAI() {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider")
  }
  return context
}
