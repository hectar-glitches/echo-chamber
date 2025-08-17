"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useBluetooth } from "@/contexts/bluetooth-context"
import { useGame } from "@/contexts/game-context"
import { Wifi, Zap, Settings, Play, Users, Timer, Target } from "lucide-react"
import type { GameState } from "@/app/page"

interface GameLobbyProps {
  onStateChange: (state: GameState) => void
}

export default function GameLobby({ onStateChange }: GameLobbyProps) {
  const { connectedDevice, latency, sendMessage, onMessageReceived } = useBluetooth()
  const { playerName, opponentName, gameSettings, updateGameSettings, resetGame } = useGame()
  const [isReady, setIsReady] = useState(false)
  const [opponentReady, setOpponentReady] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    onMessageReceived((message) => {
      if (message.type === "player_ready") {
        setOpponentReady(message.data.ready)
      } else if (message.type === "game_start") {
        onStateChange("playing")
      }
    })
  }, [onMessageReceived, onStateChange])

  useEffect(() => {
    if (isReady && opponentReady) {
      setTimeout(() => {
        sendMessage({ type: "game_start", timestamp: Date.now() })
        resetGame()
        onStateChange("playing")
      }, 1500)
    }
  }, [isReady, opponentReady, sendMessage, resetGame, onStateChange])

  const handleReadyToggle = () => {
    const newReadyState = !isReady
    setIsReady(newReadyState)
    sendMessage({
      type: "player_ready",
      timestamp: Date.now(),
      data: { ready: newReadyState },
    })
  }

  const getLatencyColor = (latency: number) => {
    if (latency < 30) return "text-green-400"
    if (latency < 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Game Lobby</h2>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-300">
          <Wifi className="h-4 w-4" />
          <span>Connected to {connectedDevice?.name}</span>
          <Badge variant="outline" className={`${getLatencyColor(latency)} border-current`}>
            {latency}ms
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-500/20 border-blue-400/30">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="font-medium">{playerName}</p>
            <Badge variant={isReady ? "default" : "outline"} className="mt-2">
              {isReady ? "Ready" : "Not Ready"}
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/20 border-purple-400/30">
          <CardContent className="p-4 text-center">
            <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <p className="font-medium">{opponentName}</p>
            <Badge variant={opponentReady ? "default" : "outline"} className="mt-2">
              {opponentReady ? "Ready" : "Not Ready"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Game Settings
            </h3>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              {showSettings ? "Hide" : "Show"}
            </Button>
          </div>

          {showSettings && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rounds: {gameSettings.roundCount}</label>
                <Slider
                  value={[gameSettings.roundCount]}
                  onValueChange={([value]) => updateGameSettings({ roundCount: value })}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Min Delay: {(gameSettings.minDelay / 1000).toFixed(1)}s
                </label>
                <Slider
                  value={[gameSettings.minDelay]}
                  onValueChange={([value]) => updateGameSettings({ minDelay: value })}
                  min={500}
                  max={3000}
                  step={100}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Max Delay: {(gameSettings.maxDelay / 1000).toFixed(1)}s
                </label>
                <Slider
                  value={[gameSettings.maxDelay]}
                  onValueChange={([value]) => updateGameSettings({ maxDelay: value })}
                  min={2000}
                  max={8000}
                  step={200}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="text-center">
              <Target className="h-6 w-6 mx-auto mb-1 text-blue-400" />
              <p className="text-xs text-gray-400">Rounds</p>
              <p className="font-semibold">{gameSettings.roundCount}</p>
            </div>
            <div className="text-center">
              <Timer className="h-6 w-6 mx-auto mb-1 text-green-400" />
              <p className="text-xs text-gray-400">Min Delay</p>
              <p className="font-semibold">{(gameSettings.minDelay / 1000).toFixed(1)}s</p>
            </div>
            <div className="text-center">
              <Timer className="h-6 w-6 mx-auto mb-1 text-yellow-400" />
              <p className="text-xs text-gray-400">Max Delay</p>
              <p className="font-semibold">{(gameSettings.maxDelay / 1000).toFixed(1)}s</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isReady && opponentReady && (
        <Card className="bg-green-500/20 border-green-400/30">
          <CardContent className="p-4 text-center">
            <div className="animate-pulse">
              <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-400" />
              <p className="font-semibold">Starting Game...</p>
              <p className="text-sm text-gray-300">Get ready to react!</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleReadyToggle}
        className={`w-full py-3 text-lg font-semibold ${
          isReady ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isReady ? (
          <>
            <Play className="h-5 w-5 mr-2" />
            Cancel Ready
          </>
        ) : (
          <>
            <Play className="h-5 w-5 mr-2" />
            Ready to Play
          </>
        )}
      </Button>
    </div>
  )
}
