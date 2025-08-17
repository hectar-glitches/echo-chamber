"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface BluetoothDevice {
  id: string
  name: string
  rssi: number
  connected: boolean
}

export interface BluetoothMessage {
  type: "game_start" | "player_ready" | "button_press" | "game_end" | "ping" | "pong"
  timestamp: number
  data?: any
  playerId?: string
}

interface BluetoothContextType {
  isScanning: boolean
  devices: BluetoothDevice[]
  connectedDevice: BluetoothDevice | null
  connectionStatus: "disconnected" | "connecting" | "connected"
  latency: number
  startScanning: () => void
  stopScanning: () => void
  connectToDevice: (device: BluetoothDevice) => Promise<void>
  disconnect: () => void
  sendMessage: (message: BluetoothMessage) => void
  onMessageReceived: (callback: (message: BluetoothMessage) => void) => void
}

const BluetoothContext = createContext<BluetoothContextType | undefined>(undefined)

export function BluetoothProvider({ children }: { children: React.ReactNode }) {
  const [isScanning, setIsScanning] = useState(false)
  const [devices, setDevices] = useState<BluetoothDevice[]>([])
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")
  const [latency, setLatency] = useState(0)
  const [messageCallback, setMessageCallback] = useState<((message: BluetoothMessage) => void) | null>(null)

  // Simulate Bluetooth device discovery
  const mockDevices: BluetoothDevice[] = [
    { id: "device-1", name: "Player's iPhone", rssi: -45, connected: false },
    { id: "device-2", name: "Gaming Phone", rssi: -52, connected: false },
    { id: "device-3", name: "React Duel", rssi: -38, connected: false },
    { id: "device-4", name: "BT Challenger", rssi: -61, connected: false },
  ]

  const startScanning = useCallback(() => {
    setIsScanning(true)
    setDevices([])

    // Simulate device discovery over time
    const discoveryInterval = setInterval(() => {
      setDevices((prev) => {
        const newDevice = mockDevices[prev.length]
        if (newDevice && prev.length < mockDevices.length) {
          return [...prev, { ...newDevice, rssi: newDevice.rssi + Math.floor(Math.random() * 10) - 5 }]
        }
        return prev
      })
    }, 800)

    // Stop scanning after 5 seconds
    setTimeout(() => {
      setIsScanning(false)
      clearInterval(discoveryInterval)
    }, 5000)
  }, [])

  const stopScanning = useCallback(() => {
    setIsScanning(false)
  }, [])

  const connectToDevice = useCallback(async (device: BluetoothDevice) => {
    setConnectionStatus("connecting")

    // Simulate connection process
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

    setConnectedDevice({ ...device, connected: true })
    setConnectionStatus("connected")

    // Start latency monitoring
    const pingInterval = setInterval(() => {
      const pingTime = Date.now()
      // Simulate network latency (20-80ms)
      const simulatedLatency = 20 + Math.random() * 60
      setTimeout(() => {
        setLatency(Math.round(simulatedLatency))
      }, simulatedLatency)
    }, 2000)

    return () => clearInterval(pingInterval)
  }, [])

  const disconnect = useCallback(() => {
    setConnectedDevice(null)
    setConnectionStatus("disconnected")
    setLatency(0)
  }, [])

  const sendMessage = useCallback(
    (message: BluetoothMessage) => {
      if (connectionStatus !== "connected") return

      // Simulate message transmission delay
      const transmissionDelay = 15 + Math.random() * 25 // 15-40ms
      setTimeout(() => {
        // Simulate receiving our own message (for testing)
        if (messageCallback) {
          messageCallback({
            ...message,
            timestamp: Date.now(),
            playerId: "opponent",
          })
        }
      }, transmissionDelay)
    },
    [connectionStatus, messageCallback],
  )

  const onMessageReceived = useCallback((callback: (message: BluetoothMessage) => void) => {
    setMessageCallback(() => callback)
  }, [])

  return (
    <BluetoothContext.Provider
      value={{
        isScanning,
        devices,
        connectedDevice,
        connectionStatus,
        latency,
        startScanning,
        stopScanning,
        connectToDevice,
        disconnect,
        sendMessage,
        onMessageReceived,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  )
}

export function useBluetooth() {
  const context = useContext(BluetoothContext)
  if (context === undefined) {
    throw new Error("useBluetooth must be used within a BluetoothProvider")
  }
  return context
}
