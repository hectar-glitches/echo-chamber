"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useBluetooth } from "@/contexts/bluetooth-context"
import { useGame } from "@/contexts/game-context"
import { Bluetooth, Search, Wifi, Zap, Users } from "lucide-react"
import type { GameState } from "@/app/page"

interface ConnectionScreenProps {
  onStateChange: (state: GameState) => void
}

export default function ConnectionScreen({ onStateChange }: ConnectionScreenProps) {
  const { isScanning, devices, connectionStatus, startScanning, connectToDevice } = useBluetooth()
  const { setPlayerName, playerName } = useGame()
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)

  useEffect(() => {
    if (connectionStatus === "connected") {
      setTimeout(() => onStateChange("lobby"), 1000)
    }
  }, [connectionStatus, onStateChange])

  const handleConnect = async (device: any) => {
    setSelectedDevice(device.id)
    await connectToDevice(device)
  }

  const getSignalStrength = (rssi: number) => {
    if (rssi > -50) return { strength: "Excellent", color: "bg-green-500", bars: 4 }
    if (rssi > -60) return { strength: "Good", color: "bg-yellow-500", bars: 3 }
    if (rssi > -70) return { strength: "Fair", color: "bg-orange-500", bars: 2 }
    return { strength: "Weak", color: "bg-red-500", bars: 1 }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Zap className="h-8 w-8 text-yellow-400" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Bluetooth Duel
          </h1>
        </div>
        <p className="text-gray-300 text-sm">Lightning-fast reaction battles</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Your Name</label>
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Bluetooth className="h-5 w-5 mr-2 text-blue-400" />
              Find Opponent
            </h3>
            <Button onClick={startScanning} disabled={isScanning} size="sm" className="bg-blue-600 hover:bg-blue-700">
              {isScanning ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Scan
                </>
              )}
            </Button>
          </div>

          {connectionStatus === "connecting" && (
            <Card className="bg-blue-500/20 border-blue-400/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-400 border-t-transparent"></div>
                  <div>
                    <p className="font-medium">Connecting...</p>
                    <p className="text-sm text-gray-300">Establishing secure connection</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {connectionStatus === "connected" && (
            <Card className="bg-green-500/20 border-green-400/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-6 bg-green-400 rounded-full flex items-center justify-center">
                    <Wifi className="h-4 w-4 text-green-900" />
                  </div>
                  <div>
                    <p className="font-medium">Connected!</p>
                    <p className="text-sm text-gray-300">Ready to duel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {devices.map((device) => {
              const signal = getSignalStrength(device.rssi)
              return (
                <Card
                  key={device.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedDevice === device.id
                      ? "bg-blue-500/30 border-blue-400/50"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                  onClick={() => handleConnect(device)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-gray-400">{device.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={`${signal.color} text-white border-0 mb-1`}>
                          {signal.strength}
                        </Badge>
                        <div className="flex space-x-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 rounded-full ${i < signal.bars ? signal.color : "bg-gray-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {!isScanning && devices.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Bluetooth className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No devices found</p>
              <p className="text-sm">Tap scan to search for opponents</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
