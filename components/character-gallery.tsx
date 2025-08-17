"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMemory } from "@/contexts/memory-context"
import { Sparkles, MessageCircle, Heart, Star, Users } from "lucide-react"
import type { Character } from "@/contexts/memory-context"

export default function CharacterGallery() {
  const { characters, memories, selectMemory } = useMemory()
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [dialogueIndex, setDialogueIndex] = useState(0)

  const getShapeIcon = (shape: Character["appearance"]["shape"]) => {
    switch (shape) {
      case "crystal":
        return "💎"
      case "orb":
        return "🔮"
      case "tree":
        return "🌳"
      case "flower":
        return "🌸"
      case "star":
        return "⭐"
      case "book":
        return "📚"
      default:
        return "✨"
    }
  }

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character)
    setDialogueIndex(0)
  }

  const nextDialogue = () => {
    if (selectedCharacter) {
      setDialogueIndex((prev) => (prev + 1) % selectedCharacter.dialogue.length)
    }
  }

  const viewMemory = (character: Character) => {
    selectMemory(character.memoryId)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Character Gallery</h1>
        <p className="text-purple-200">Meet the AI personalities born from your memories</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Character Grid */}
        <div className="lg:col-span-2">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                Your Memory Characters ({characters.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {characters.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No characters created yet</p>
                  <p className="text-sm">Create memories to generate AI characters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characters.map((character) => {
                    const memory = memories.find((m) => m.id === character.memoryId)
                    return (
                      <div
                        key={character.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedCharacter?.id === character.id
                            ? "bg-purple-500/30 border-2 border-purple-400"
                            : "bg-white/5 hover:bg-white/10 border-2 border-transparent"
                        }`}
                        onClick={() => handleCharacterSelect(character)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{ backgroundColor: character.appearance.color + "40" }}
                          >
                            {getShapeIcon(character.appearance.shape)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{character.name}</h3>
                            <p className="text-xs text-gray-400">{memory?.title || "Unknown Memory"}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ color: character.appearance.color, borderColor: character.appearance.color }}
                            >
                              {character.appearance.shape}
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 line-clamp-2 mb-3">{character.personality}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1 text-xs text-gray-400">
                            <MessageCircle className="h-3 w-3" />
                            <span>{character.dialogue.length} dialogues</span>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              viewMemory(character)
                            }}
                            className="text-purple-400 hover:text-purple-300"
                          >
                            View Memory
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Character Detail Panel */}
        <div className="lg:col-span-1">
          <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                Character Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!selectedCharacter ? (
                <div className="text-center py-8 text-gray-400">
                  <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a character to view details</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Character Avatar */}
                  <div className="text-center">
                    <div
                      className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-3"
                      style={{ backgroundColor: selectedCharacter.appearance.color + "40" }}
                    >
                      {getShapeIcon(selectedCharacter.appearance.shape)}
                    </div>
                    <h2 className="text-xl font-bold">{selectedCharacter.name}</h2>
                    <Badge
                      variant="outline"
                      className="mt-2"
                      style={{
                        color: selectedCharacter.appearance.color,
                        borderColor: selectedCharacter.appearance.color,
                      }}
                    >
                      {selectedCharacter.appearance.shape}
                    </Badge>
                  </div>

                  {/* Personality */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-pink-400" />
                      Personality
                    </h3>
                    <p className="text-sm text-gray-300 bg-white/5 p-3 rounded">{selectedCharacter.personality}</p>
                  </div>

                  {/* Dialogue */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1 text-blue-400" />
                        Dialogue
                      </h3>
                      <span className="text-xs text-gray-400">
                        {dialogueIndex + 1} of {selectedCharacter.dialogue.length}
                      </span>
                    </div>
                    <div className="bg-white/5 p-3 rounded mb-3">
                      <p className="text-sm text-gray-300 italic">"{selectedCharacter.dialogue[dialogueIndex]}"</p>
                    </div>
                    {selectedCharacter.dialogue.length > 1 && (
                      <Button
                        onClick={nextDialogue}
                        size="sm"
                        variant="outline"
                        className="w-full border-white/20 text-white hover:bg-white/10"
                      >
                        Next Dialogue
                      </Button>
                    )}
                  </div>

                  {/* Related Memory */}
                  <div>
                    <h3 className="font-semibold mb-2">Related Memory</h3>
                    <Button
                      onClick={() => viewMemory(selectedCharacter)}
                      variant="outline"
                      className="w-full border-purple-400/50 text-purple-300 hover:bg-purple-500/20"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      View "{memories.find((m) => m.id === selectedCharacter.memoryId)?.title}"
                    </Button>
                  </div>

                  {/* Character Stats */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-lg font-bold" style={{ color: selectedCharacter.appearance.color }}>
                        {selectedCharacter.appearance.size.toFixed(1)}x
                      </div>
                      <div className="text-xs text-gray-400">Size</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-400">{selectedCharacter.dialogue.length}</div>
                      <div className="text-xs text-gray-400">Dialogues</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Character Statistics */}
      <Card className="bg-black/20 backdrop-blur-lg border-white/10 text-white">
        <CardHeader>
          <CardTitle>Character Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{characters.length}</div>
              <div className="text-sm text-gray-300">Total Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {new Set(characters.map((c) => c.appearance.shape)).size}
              </div>
              <div className="text-sm text-gray-300">Unique Shapes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {characters.reduce((sum, c) => sum + c.dialogue.length, 0)}
              </div>
              <div className="text-sm text-gray-300">Total Dialogues</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {(characters.reduce((sum, c) => sum + c.appearance.size, 0) / characters.length || 0).toFixed(1)}x
              </div>
              <div className="text-sm text-gray-300">Avg Size</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
