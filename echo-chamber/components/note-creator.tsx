"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMemory } from "@/contexts/memory-context"
import { useAI } from "@/contexts/ai-context"
import { Brain, Sparkles, Wand2, Save } from "lucide-react"
import type { Memory } from "@/contexts/memory-context"
import type { ViewMode } from "@/app/page"

interface NoteCreatorProps {
  onViewChange: (view: ViewMode) => void
}

export default function NoteCreator({ onViewChange }: NoteCreatorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<Memory["type"]>("thought")
  const [isCreating, setIsCreating] = useState(false)
  const [aiPreview, setAiPreview] = useState<{
    summary: string
    tags: string[]
    emotion: Memory["emotion"]
    character: any
  } | null>(null)

  const { addMemory, isProcessing } = useMemory()
  const { processMemory, isAnalyzing } = useAI()

  const handlePreview = async () => {
    if (!content.trim()) return

    try {
      const preview = await processMemory(content, type)
      setAiPreview(preview)
    } catch (error) {
      console.error("Failed to generate preview:", error)
    }
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return

    setIsCreating(true)

    try {
      let processedData = aiPreview

      if (!processedData) {
        processedData = await processMemory(content, type)
      }

      await addMemory({
        title: title.trim(),
        content: content.trim(),
        type,
        tags: processedData.tags,
        emotion: processedData.emotion,
        aiSummary: processedData.summary,
        aiCharacter: {
          ...processedData.character,
          memoryId: "", // Will be set by the context
        },
      })

      // Reset form
      setTitle("")
      setContent("")
      setAiPreview(null)

      // Navigate back to palace
      onViewChange("palace")
    } catch (error) {
      console.error("Failed to save memory:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const getTypeColor = (type: Memory["type"]) => {
    const colors = {
      thought: "bg-blue-500/20 text-blue-300 border-blue-400",
      dream: "bg-purple-500/20 text-purple-300 border-purple-400",
      idea: "bg-yellow-500/20 text-yellow-300 border-yellow-400",
      experience: "bg-green-500/20 text-green-300 border-green-400",
      reflection: "bg-pink-500/20 text-pink-300 border-pink-400",
    }
    return colors[type]
  }

  const getEmotionColor = (emotion: Memory["emotion"]) => {
    const colors = {
      joy: "text-yellow-400",
      sadness: "text-blue-400",
      excitement: "text-red-400",
      calm: "text-green-400",
      curiosity: "text-purple-400",
      nostalgia: "text-orange-400",
    }
    return colors[emotion]
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Create New Memory</h1>
        <p className="text-purple-200">Capture your thoughts and let AI bring them to life</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-400" />
              Memory Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your memory a title..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <Select value={type} onValueChange={(value) => setType(value as Memory["type"])}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="thought">💭 Thought</SelectItem>
                  <SelectItem value="dream">🌙 Dream</SelectItem>
                  <SelectItem value="idea">💡 Idea</SelectItem>
                  <SelectItem value="experience">🌟 Experience</SelectItem>
                  <SelectItem value="reflection">🤔 Reflection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your memory in detail..."
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[200px]"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handlePreview}
                disabled={!content.trim() || isAnalyzing}
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10"
              >
                {isAnalyzing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    AI Preview
                  </>
                )}
              </Button>

              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim() || isCreating || isProcessing}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                {isCreating || isProcessing ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Memory
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Preview */}
        <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!aiPreview ? (
              <div className="text-center py-12 text-gray-400">
                <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Click "AI Preview" to see how your memory will be processed</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Summary</h4>
                  <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">{aiPreview.summary}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Detected Emotion</h4>
                  <Badge className={`${getEmotionColor(aiPreview.emotion)} border-current`}>{aiPreview.emotion}</Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Generated Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiPreview.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">AI Character</h4>
                  <div className="bg-white/5 p-4 rounded space-y-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: aiPreview.character.appearance.color }}
                      />
                      <span className="font-medium">{aiPreview.character.name}</span>
                    </div>
                    <p className="text-sm text-gray-300">{aiPreview.character.personality}</p>
                    <div className="text-xs text-gray-400 italic">"{aiPreview.character.dialogue[0]}"</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
