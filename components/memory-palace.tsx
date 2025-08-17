"use client"

import { useRef, useState } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import { Text, Sphere, Box, Octahedron, Torus, Cone } from "@react-three/drei"
import { useMemory } from "@/contexts/memory-context"
import type { Memory } from "@/contexts/memory-context"
import * as THREE from "three"

function MemoryArtifact({ memory, onClick }: { memory: Memory; onClick: () => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
      meshRef.current.position.y = memory.position[1] + Math.sin(state.clock.elapsedTime + memory.position[0]) * 0.1

      if (hovered) {
        meshRef.current.scale.setScalar(1.2)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const getGeometry = () => {
    if (!memory.aiCharacter) return <Sphere args={[0.5]} />

    switch (memory.aiCharacter.appearance.shape) {
      case "crystal":
        return <Octahedron args={[0.5]} />
      case "orb":
        return <Sphere args={[0.5]} />
      case "tree":
        return <Cone args={[0.3, 1]} />
      case "flower":
        return <Torus args={[0.4, 0.2]} />
      case "star":
        return <Octahedron args={[0.6]} />
      case "book":
        return <Box args={[0.4, 0.6, 0.1]} />
      default:
        return <Sphere args={[0.5]} />
    }
  }

  const color = memory.aiCharacter?.appearance.color || "#8B5CF6"

  return (
    <group position={memory.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getGeometry()}
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {hovered && (
        <Text position={[0, 1, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          {memory.title}
        </Text>
      )}

      {/* Floating particles around the artifact */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.cos(i * 1.26) * 1.5, Math.sin(i * 1.26) * 0.5, Math.sin(i * 1.26) * 1.5]}>
          <Sphere args={[0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function ConnectionLines() {
  const { memories } = useMemory()

  return (
    <>
      {memories.map((memory) =>
        memory.connections.map((connectionId) => {
          const connectedMemory = memories.find((m) => m.id === connectionId)
          if (!connectedMemory) return null

          const points = [new THREE.Vector3(...memory.position), new THREE.Vector3(...connectedMemory.position)]

          return (
            <line key={`${memory.id}-${connectionId}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={points.length}
                  array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial color="#8B5CF6" opacity={0.3} transparent />
            </line>
          )
        }),
      )}
    </>
  )
}

function PalaceEnvironment() {
  const groundRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (groundRef.current) {
      const material = groundRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })

  return (
    <>
      {/* Ground */}
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" emissive="#16213e" emissiveIntensity={0.1} />
      </mesh>

      {/* Ambient structures */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const radius = 8
        return (
          <mesh key={i} position={[Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius]}>
            <Box args={[0.2, 1, 0.2]} />
            <meshStandardMaterial color="#4C1D95" emissive="#4C1D95" emissiveIntensity={0.2} />
          </mesh>
        )
      })}
    </>
  )
}

export default function MemoryPalace() {
  const { memories, selectMemory } = useMemory()
  const { camera } = useThree()

  const handleArtifactClick = (memory: Memory) => {
    selectMemory(memory.id)
    // Animate camera to focus on the memory
    camera.position.set(memory.position[0] + 3, memory.position[1] + 2, memory.position[2] + 3)
  }

  return (
    <>
      <PalaceEnvironment />
      <ConnectionLines />
      {memories.map((memory) => (
        <MemoryArtifact key={memory.id} memory={memory} onClick={() => handleArtifactClick(memory)} />
      ))}
    </>
  )
}
