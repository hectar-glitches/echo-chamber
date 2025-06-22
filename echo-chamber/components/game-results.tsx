"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/contexts/game-context"
import { useBluetooth } from "@/contexts/bluetooth-context"
import { Trophy, Target, Timer, RotateCcw, Home } from "lucide-react"
import type { GameState } from "@/app/page"

interface GameResultsProps {
  onStateChange: (state: GameState) => void
}

export default function GameResults({ onStateChange }: GameResultsProps) {
  const { score, rounds, playerName, opponentName, resetGame } = useGame()
  const { disconnect } = useBluetooth()

  const gameWinner = score.player > score.opponent ? "player" : score.opponent > score.player ? "opponent" : "tie"

  const playerStats = {
    avgReactionTime: rounds.reduce((sum, round) => sum + (round.playerTime || 0), 0) / rounds.length,
    bestTime: Math.min(...rounds.map((round) => round.playerTime || Number.POSITIVE_INFINITY)),
    wins: rounds.filter((round) => round.winner === "player").length,
  }

  const opponentStats = {
    avgReactionTime: rounds.reduce((sum, round) => sum + (round.opponentTime || 0), 0) / rounds.length,
    bestTime: Math.min(...rounds.map((round) => round.opponentTime || Number.POSITIVE_INFINITY)),
    wins: rounds.filter((round) => round.winner === "opponent").length,
  }

  const handlePlayAgain = () => {
    resetGame()
    onStateChange("lobby")
  }

  const handleDisconnect = () => {
    disconnect()
    resetGame()
    onStateChange("connecting")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Game Winner */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          {gameWinner === "tie" ? (
            <div className="h-20 w-20 bg-yellow-500 rounded-full flex items-center justify-center">
              <Timer className="h-10 w-10 text-white" />
            </div>
          ) : (
            <div className="h-20 w-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
              <Trophy className="h-10 w-10 text-white" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">
            {gameWinner === "tie" ? "It's a Tie!" : `${gameWinner === "player" ? playerName : opponentName} Wins!`}
          </h2>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <p className="text-sm text-gray-400">{playerName}</p>
              <p className="text-3xl font-bold text-blue-400">{score.player}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400">{opponentName}</p>
              <p className="text-3xl font-bold text-purple-400">{score.opponent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Player Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-blue-500/20 border-blue-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-center">{playerName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-400">Average Time</p>
              <p className="text-lg font-bold">{Math.round(playerStats.avgReactionTime)}ms</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Best Time</p>
              <p className="text-lg font-bold text-green-400">
                {playerStats.bestTime === Number.POSITIVE_INFINITY ? "N/A" : `${playerStats.bestTime}ms`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Rounds Won</p>
              <p className="text-lg font-bold">{playerStats.wins}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/20 border-purple-400/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-center">{opponentName}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-400">Average Time</p>
              <p className="text-lg font-bold">{Math.round(opponentStats.avgReactionTime)}ms</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Best Time</p>
              <p className="text-lg font-bold text-green-400">
                {opponentStats.bestTime === Number.POSITIVE_INFINITY ? "N/A" : `${opponentStats.bestTime}ms`}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-400">Rounds Won</p>
              <p className="text-lg font-bold">{opponentStats.wins}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Round History */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-sm flex items-center">
            <Target className="h-4 w-4 mr-2" />
            Round History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rounds.map((round, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Round {round.roundNumber}</span>
                <Badge
                  variant="outline"
                  className={
                    round.winner === "player"
                      ? "text-blue-400 border-blue-400"
                      : round.winner === "opponent"
                        ? "text-purple-400 border-purple-400"
                        : "text-yellow-400 border-yellow-400"
                  }
                >
                  {round.winner === "tie" ? "Tie" : round.winner === "player" ? playerName : opponentName}
                </Badge>
              </div>
              <div className="flex space-x-4 text-xs">
                <span className="text-blue-400">{round.playerTime ? `${round.playerTime}ms` : "N/A"}</span>
                <span className="text-purple-400">{round.opponentTime ? `${round.opponentTime}ms` : "N/A"}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button onClick={handlePlayAgain} className="w-full bg-green-600 hover:bg-green-700">
          <RotateCcw className="h-4 w-4 mr-2" />
          Play Again
        </Button>
        <Button onClick={handleDisconnect} variant="outline" className="w-full">
          <Home className="h-4 w-4 mr-2" />
          Disconnect & Return Home
        </Button>
      </div>
    </div>
  )
}
