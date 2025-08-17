"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Plus, Map, Sparkles, BookOpen, Settings } from "lucide-react"
import MemoryPalace from "@/components/memory-palace"
import NoteCreator from "@/components/note-creator"
import MemoryInsights from "@/components/memory-insights"
import CharacterGallery from "@/components/character-gallery"
import { MemoryProvider } from "@/contexts/memory-context"
import { AIProvider } from "@/contexts/ai-context"

export type ViewMode = "palace" | "create" | "insights" | "gallery" | "settings"

export default function EchoChamber() {
  const [viewMode, setViewMode] = useState<ViewMode>("palace")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <Brain className="h-16 w-16 text-purple-400 animate-pulse mx-auto" />
            <div className="absolute inset-0 bg-purple-400/20 rounded-full animate-ping" />
          </div>
          <h1 className="text-2xl font-bold text-white">EchoChamber</h1>
          <p className="text-purple-200">Awakening your memory palace...</p>
        </div>
      </div>
    )
  }

  return (
    <AIProvider>
      <MemoryProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
          {/* Header */}
          <header className="relative z-10 p-4 bg-black/20 backdrop-blur-sm border-b border-white/10">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Brain className="h-8 w-8 text-purple-400" />
                  <Sparkles className="h-4 w-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">EchoChamber</h1>
                  <p className="text-xs text-purple-200">Your AI Memory Palace</p>
                </div>
              </div>

              <nav className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "palace" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("palace")}
                  className="text-white"
                >
                  <Map className="h-4 w-4 mr-1" />
                  Palace
                </Button>
                <Button
                  variant={viewMode === "create" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("create")}
                  className="text-white"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Button>
                <Button
                  variant={viewMode === "insights" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("insights")}
                  className="text-white"
                >
                  <BookOpen className="h-4 w-4 mr-1" />
                  Insights
                </Button>
                <Button
                  variant={viewMode === "gallery" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("gallery")}
                  className="text-white"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Gallery
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setViewMode("settings")} className="text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="relative">
            {viewMode === "palace" && (
              <div className="h-screen">
                <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
                  <Environment preset="sunset" />
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <MemoryPalace />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                </Canvas>
              </div>
            )}

            {viewMode === "create" && (
              <div className="container mx-auto p-6">
                <NoteCreator onViewChange={setViewMode} />
              </div>
            )}

            {viewMode === "insights" && (
              <div className="container mx-auto p-6">
                <MemoryInsights />
              </div>
            )}

            {viewMode === "gallery" && (
              <div className="container mx-auto p-6">
                <CharacterGallery />
              </div>
            )}

            {viewMode === "settings" && (
              <div className="container mx-auto p-6">
                <Card className="max-w-2xl mx-auto bg-black/20 backdrop-blur-lg border-white/10 text-white">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold mb-4">Settings</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Palace Theme</h3>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" className="text-white border-white/20">
                            Enchanted Garden
                          </Button>
                          <Button variant="outline" size="sm" className="text-white border-white/20">
                            Crystal Castle
                          </Button>
                          <Button variant="outline" size="sm" className="text-white border-white/20">
                            Cosmic Library
                          </Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">AI Processing</h3>
                        <div className="space-y-2">
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Auto-categorize memories</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Generate character personalities</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">Find memory connections</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>

          {/* Floating Stats */}
          {viewMode === "palace" && (
            <div className="absolute top-20 left-4 z-10 space-y-2">
              <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">42 Memories</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black/30 backdrop-blur-sm border-white/10 text-white">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">12 Characters</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </MemoryProvider>
    </AIProvider>
  )
}
