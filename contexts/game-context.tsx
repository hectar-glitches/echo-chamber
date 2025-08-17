"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface GameScore {
  player: number
  opponent: number
}

export interface GameRound {
  roundNumber: number
  winner: "player" | "opponent" | "tie"
  playerTime: number | null
  opponentTime: number | null
  reactionDelay: number
}

interface GameContextType {
  playerName: string
  opponentName: string
  score: GameScore
  rounds: GameRound[]
  currentRound: number
  gameSettings: {
    roundCount: number
    minDelay: number
    maxDelay: number
  }
  setPlayerName: (name: string) => void
  setOpponentName: (name: string) => void
  addRound: (round: GameRound) => void
  resetGame: () => void
  updateGameSettings: (settings: Partial<GameContextType["gameSettings"]>) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [playerName, setPlayerName] = useState("You")
  const [opponentName, setOpponentName] = useState("Opponent")
  const [score, setScore] = useState<GameScore>({ player: 0, opponent: 0 })
  const [rounds, setRounds] = useState<GameRound[]>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [gameSettings, setGameSettings] = useState({
    roundCount: 5,
    minDelay: 1000,
    maxDelay: 5000,
  })

  const addRound = useCallback((round: GameRound) => {
    setRounds((prev) => [...prev, round])
    setCurrentRound((prev) => prev + 1)

    // Update score
    setScore((prev) => ({
      player: prev.player + (round.winner === "player" ? 1 : 0),
      opponent: prev.opponent + (round.winner === "opponent" ? 1 : 0),
    }))
  }, [])

  const resetGame = useCallback(() => {
    setScore({ player: 0, opponent: 0 })
    setRounds([])
    setCurrentRound(1)
  }, [])

  const updateGameSettings = useCallback((settings: Partial<GameContextType["gameSettings"]>) => {
    setGameSettings((prev) => ({ ...prev, ...settings }))
  }, [])

  return (
    <GameContext.Provider
      value={{
        playerName,
        opponentName,
        score,
        rounds,
        currentRound,
        gameSettings,
        setPlayerName,
        setOpponentName,
        addRound,
        resetGame,
        updateGameSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
