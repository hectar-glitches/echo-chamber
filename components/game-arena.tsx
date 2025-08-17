"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBluetooth } from "@/contexts/bluetooth-context"
import { useGame } from "@/contexts/game-context"
import { Zap, Target, Timer, Trophy } from "lucide-react"
import type { GameState } from "@/app/page"

interface GameArenaProps {
  onStateChange: (state: GameState) => void
}

type RoundState = "waiting" | "ready" | "active" | "finished"

export default function GameArena({ onStateChange }: GameArenaProps) {
  const { sendMessage, onMessageReceived, latency } = useBluetooth()
  const { score, currentRound, gameSettings, addRound, playerName, opponentName } = useGame()

  const [roundState, setRoundState] = useState<RoundState>("waiting")
  const [countdown, setCountdown] = useState(3)
  const [reactionStartTime, setReactionStartTime] = useState<number | null>(null)
  const [playerReactionTime, setPlayerReactionTime] = useState<number | null>(null)
  const [opponentReactionTime, setOpponentReactionTime] = useState<number | null>(null)
  const [roundWinner, setRoundWinner] = useState<"player" | "opponent" | "tie" | null>(null)
  const [reactionDelay, setReactionDelay] = useState(0)

  const audioContextRef = useRef<AudioContext | null>(null)
  const gameStartTimeRef = useRef<number>(0)

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Play sound effect
  const playSound = useCallback((frequency: number, duration: number) => {
    if (!audioContextRef.current) return

    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)

    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }, [])

  // Haptic feedback simulation
  const triggerHaptic = useCallback((pattern: number[]) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern)
    }
  }, [])

  // Handle incoming messages
  useEffect(() => {
    onMessageReceived((message) => {
      if (message.type === "button_press") {
        setOpponentReactionTime(message.data.reactionTime)
      }
    })
  }, [onMessageReceived])

  // Start new round
  const startRound = useCallback(() => {
    setRoundState("ready")
    setCountdown(3)
    setPlayerReactionTime(null)
    setOpponentReactionTime(null)
    setRoundWinner(null)

    // Countdown
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval)

          // Random delay before showing the target
          const delay = gameSettings.minDelay + Math.random() * (gameSettings.maxDelay - gameSettings.minDelay)
          setReactionDelay(Math.round(delay))

          setTimeout(() => {
            setRoundState("active")
            setReactionStartTime(Date.now())
            gameStartTimeRef.current = Date.now()
            playSound(800, 0.2) // High-pitched beep
            triggerHaptic([50])
          }, delay)

          return 0
        }
        playSound(400, 0.1) // Countdown beep
        return prev - 1
      })
    }, 1000)
  }, [gameSettings, playSound, triggerHaptic])

  // Handle player button press
  const handlePlayerPress = useCallback(() => {
    if (roundState !== "active" || playerReactionTime !== null) return

    const reactionTime = Date.now() - (reactionStartTime || 0)
    setPlayerReactionTime(reactionTime)

    // Send reaction time to opponent
    sendMessage({
      type: "button_press",
      timestamp: Date.now(),
      data: { reactionTime },
    })

    playSound(600, 0.3) // Success sound
    triggerHaptic([100, 50, 100])
  }, [roundState, playerReactionTime, reactionStartTime, sendMessage, playSound, triggerHaptic])

  // Determine round winner and advance
  useEffect(() => {
    if (playerReactionTime !== null && opponentReactionTime !== null && roundState === "active") {
      setRoundState("finished")

      let winner: "player" | "opponent" | "tie"
      if (Math.abs(playerReactionTime - opponentReactionTime) < 10) {
        winner = "tie"
      } else if (playerReactionTime < opponentReactionTime) {
        winner = "player"
      } else {
        winner = "opponent"
      }

      setRoundWinner(winner)

      // Add round to game state
      addRound({
        roundNumber: currentRound,
        winner,
        playerTime: playerReactionTime,
        opponentTime: opponentReactionTime,
        reactionDelay,
      })

      // Play winner sound
      if (winner === "player") {
        playSound(1000, 0.5) // Victory sound
        triggerHaptic([200, 100, 200])
      } else if (winner === "opponent") {
        playSound(300, 0.5) // Defeat sound
        triggerHaptic([500])
      } else {
        playSound(500, 0.3) // Tie sound
        triggerHaptic([100, 100, 100])
      }

      // Check if game is over
      setTimeout(() => {
        if (currentRound >= gameSettings.roundCount) {
          onStateChange("results")
        } else {
          startRound()
        }
      }, 2500)
    }
  }, [
    playerReactionTime,
    opponentReactionTime,
    roundState,
    currentRound,
    gameSettings.roundCount,
    addRound,
    reactionDelay,
    onStateChange,
    startRound,
    playSound,
    triggerHaptic,
  ])

  // Start first round
  useEffect(() => {
    if (roundState === "waiting") {
      setTimeout(startRound, 1000)
    }
  }, [roundState, startRound])

  const getRoundStateDisplay = () => {
    switch (roundState) {
      case "waiting":
        return { text: "Get Ready...", color: "text-yellow-400", bg: "bg-yellow-500/20" }
      case "ready":
        return { text: countdown > 0 ? countdown.toString() : "Wait...", color: "text-blue-400", bg: "bg-blue-500/20" }
      case "active":
        return { text: "TAP NOW!", color: "text-red-400", bg: "bg-red-500/30" }
      case "finished":
        return { text: "Round Complete", color: "text-green-400", bg: "bg-green-500/20" }
    }
  }

  const stateDisplay = getRoundStateDisplay()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-4 mb-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400">
            Round {currentRound}/{gameSettings.roundCount}
          </Badge>
          <Badge variant="outline" className="text-gray-400 border-gray-400">
            {latency}ms
          </Badge>
        </div>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-sm text-gray-400">{playerName}</p>
            <p className="text-2xl font-bold text-blue-400">{score.player}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-400">{opponentName}</p>
            <p className="text-2xl font-bold text-purple-400">{score.opponent}</p>
          </div>
        </div>
      </div>

      {/* Game State Display */}
      <Card className={`${stateDisplay.bg} border-white/20`}>
        <CardContent className="p-8 text-center">
          <div className={`text-4xl font-bold ${stateDisplay.color} mb-4`}>{stateDisplay.text}</div>
          {roundState === "ready" && countdown === 0 && <p className="text-gray-300">Wait for the signal...</p>}
          {roundState === "active" && <Target className={`h-16 w-16 mx-auto ${stateDisplay.color} animate-pulse`} />}
        </CardContent>
      </Card>

      {/* Reaction Button */}
      <Button
        onClick={handlePlayerPress}
        disabled={roundState !== "active" || playerReactionTime !== null}
        className={`w-full h-24 text-xl font-bold transition-all duration-200 ${
          roundState === "active" ? "bg-red-600 hover:bg-red-700 scale-105 shadow-lg shadow-red-500/50" : "bg-gray-600"
        }`}
      >
        <Zap className="h-8 w-8 mr-3" />
        REACT!
      </Button>

      {/* Round Results */}
      {roundState === "finished" && (
        <Card className="bg-white/10 border-white/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <p className="text-sm text-gray-400">{playerName}</p>
                <p className="text-lg font-bold text-blue-400">
                  {playerReactionTime ? `${playerReactionTime}ms` : "No reaction"}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-400">{opponentName}</p>
                <p className="text-lg font-bold text-purple-400">
                  {opponentReactionTime ? `${opponentReactionTime}ms` : "No reaction"}
                </p>
              </div>
            </div>

            <div className="text-center">
              {roundWinner === "tie" ? (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <Timer className="h-4 w-4 mr-1" />
                  Tie!
                </Badge>
              ) : (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Trophy className="h-4 w-4 mr-1" />
                  {roundWinner === "player" ? playerName : opponentName} Wins!
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
