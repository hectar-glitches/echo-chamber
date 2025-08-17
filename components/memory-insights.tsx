"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useMemory } from "@/contexts/memory-context"
import { useAI } from "@/contexts/ai-context"
import { Brain, Search, TrendingUp, Link, Lightbulb, RefreshCw, Filter } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function MemoryInsights() {
  const { memories, searchMemories, getMemoriesByTag, getMemoriesByEmotion } = useMemory()
  const { insights, generateInsights, isAnalyzing } = useAI()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<"all" | "emotion" | "tag">("all")
  const [searchResults, setSearchResults] = useState(memories)

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchMemories(searchQuery))
    } else {
      setSearchResults(memories)
    }
  }, [searchQuery, memories, searchMemories])

  // Generate statistics
  const emotionStats = memories.reduce(
    (acc, memory) => {
      acc[memory.emotion] = (acc[memory.emotion] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const typeStats = memories.reduce(
    (acc, memory) => {
      acc[memory.type] = (acc[memory.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const emotionChartData = Object.entries(emotionStats).map(([emotion, count]) => ({
    name: emotion,
    value: count,
    color:
      {
        joy: "#FFD700",
        sadness: "#4682B4",
        excitement: "#FF6347",
        calm: "#98FB98",
        curiosity: "#DDA0DD",
        nostalgia: "#F4A460",
      }[emotion as keyof typeof emotionStats] || "#8B5CF6",
  }))

  const typeChartData = Object.entries(typeStats).map(([type, count]) => ({
    name: type,
    count,
  }))

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "connection":
        return <Link className="h-4 w-4" />
      case "pattern":
        return <TrendingUp className="h-4 w-4" />
      case "theme":
        return <Brain className="h-4 w-4" />
      case "suggestion":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "connection":
        return "text-blue-400 border-blue-400"
      case "pattern":
        return "text-green-400 border-green-400"
      case "theme":
        return "text-purple-400 border-purple-400"
      case "suggestion":
        return "text-yellow-400 border-yellow-400"
      default:
        return "text-gray-400 border-gray-400"
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Memory Insights</h1>
        <p className="text-purple-200">Discover patterns and connections in your thoughts</p>
      </div>

      {/* Search and Controls */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your memories..."
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
            <Button onClick={generateInsights} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700">
              {isAnalyzing ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Insights
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-purple-400" />
            <div className="text-2xl font-bold">{memories.length}</div>
            <div className="text-sm text-gray-300">Total Memories</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4 text-center">
            <Link className="h-8 w-8 mx-auto mb-2 text-blue-400" />
            <div className="text-2xl font-bold">{memories.reduce((sum, m) => sum + m.connections.length, 0)}</div>
            <div className="text-sm text-gray-300">Connections</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-400" />
            <div className="text-2xl font-bold">{insights.length}</div>
            <div className="text-sm text-gray-300">AI Insights</div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardContent className="p-4 text-center">
            <Filter className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
            <div className="text-2xl font-bold">{new Set(memories.flatMap((m) => m.tags)).size}</div>
            <div className="text-sm text-gray-300">Unique Tags</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle>Memory Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={typeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle>Emotional Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={emotionChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {emotionChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-400" />
            AI-Generated Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No insights generated yet</p>
              <p className="text-sm">Click "Generate Insights" to analyze your memories</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight.id} className="bg-white/5 p-4 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getInsightIcon(insight.type)}
                    <h3 className="font-semibold">{insight.title}</h3>
                    <Badge variant="outline" className={getInsightColor(insight.type)}>
                      {insight.type}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-gray-400 border-gray-500">
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-gray-300 mb-3">{insight.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>Related memories:</span>
                  {insight.relatedMemories.map((memoryId, index) => {
                    const memory = memories.find((m) => m.id === memoryId)
                    return memory ? (
                      <Badge key={memoryId} variant="outline" className="text-xs">
                        {memory.title}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle>Search Results ({searchResults.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((memory) => (
                <div key={memory.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold truncate">{memory.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {memory.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2 mb-2">{memory.content}</p>
                  <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
