'use client'

import { createContext, useContext } from 'react'
import { GameState, MyNumber, GameRules, ClientMessage } from './game-types'

export interface GameContextValue {
  // Connection state
  isConnected: boolean
  roomCode: string | null
  playerName: string | null
  
  // Game state
  gameState: GameState | null
  myNumber: MyNumber | null
  lastResult: { success: boolean; score: number } | null
  
  // Actions
  connect: (roomCode: string, playerName: string) => void
  disconnect: () => void
  sendMessage: (message: ClientMessage) => void
  
  // Local state
  setRoomCode: (code: string | null) => void
  setPlayerName: (name: string | null) => void
}

export const GameContext = createContext<GameContextValue | null>(null)

export function useGame() {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
}
