'use client'

import { useState, useCallback, useRef, useEffect, ReactNode } from 'react'
import { GameContext, GameContextValue } from '@/lib/game-store'
import { GameState, MyNumber, ClientMessage, ServerMessage } from '@/lib/game-types'

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8765'

interface GameProviderProps {
  children: ReactNode
}

export function GameProvider({ children }: GameProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [roomCode, setRoomCode] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [myNumber, setMyNumber] = useState<MyNumber | null>(null)
  const [lastResult, setLastResult] = useState<{ success: boolean; score: number } | null>(null)
  
  const wsRef = useRef<WebSocket | null>(null)
  
  const connect = useCallback((code: string, name: string) => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    
    const ws = new WebSocket(`${WS_BASE_URL}/ws/${code}/${encodeURIComponent(name)}`)
    
    ws.onopen = () => {
      setIsConnected(true)
      setRoomCode(code)
      setPlayerName(name)
    }
    
    ws.onmessage = (event) => {
      try {
        const message: ServerMessage = JSON.parse(event.data)
        
        switch (message.type) {
          case 'state':
            setGameState(message.data)
            break
          case 'your_number':
            setMyNumber({ number: message.number, label: message.label })
            break
          case 'round_result':
            setLastResult({ success: message.success, score: message.score })
            break
          case 'player_joined':
            console.log(`${message.name} joined`)
            break
          case 'player_left':
            console.log(`${message.name} left`)
            break
          case 'error':
            console.error('Game error:', message.message)
            break
        }
      } catch (e) {
        console.error('Failed to parse message:', e)
      }
    }
    
    ws.onclose = () => {
      setIsConnected(false)
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setIsConnected(false)
    }
    
    wsRef.current = ws
  }, [])
  
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setGameState(null)
    setMyNumber(null)
    setLastResult(null)
  }, [])
  
  const sendMessage = useCallback((message: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])
  
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])
  
  const value: GameContextValue = {
    isConnected,
    roomCode,
    playerName,
    gameState,
    myNumber,
    lastResult,
    connect,
    disconnect,
    sendMessage,
    setRoomCode,
    setPlayerName,
  }
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}
