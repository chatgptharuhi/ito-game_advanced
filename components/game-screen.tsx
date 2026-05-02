'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GameProvider } from './game-provider'
import { useGame } from '@/lib/game-store'
import { HomeScreen } from './screens/home-screen'
import { LobbyScreen } from './screens/lobby-screen'
import { DescribingScreen } from './screens/describing-screen'
import { OrderingScreen } from './screens/ordering-screen'
import { RevealingScreen } from './screens/revealing-screen'
import { RoundEndScreen } from './screens/round-end-screen'
import { GameOverScreen } from './screens/game-over-screen'
import { GameState, GameRules, DEFAULT_RULES, DEFAULT_THEMES } from '@/lib/game-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

// Demo mode for when no backend is connected
function useDemoMode() {
  const [demoState, setDemoState] = useState<GameState | null>(null)
  const [myNumber, setMyNumber] = useState<{ number: number; label: string } | null>(null)
  const [lastResult, setLastResult] = useState<{ success: boolean; score: number } | null>(null)
  const [playerName, setPlayerName] = useState<string | null>(null)
  
  const createDemoRoom = useCallback((name: string) => {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase()
    setPlayerName(name)
    setDemoState({
      code,
      phase: 'lobby',
      current_round: 0,
      total_rounds: 5,
      total_score: 0,
      rules: { ...DEFAULT_RULES },
      round: null,
      players: [
        { id: '1', name, is_host: true, has_described: false, description: null, number: null, is_oni: false },
        { id: '2', name: 'あかね', is_host: false, has_described: false, description: null, number: null, is_oni: false },
        { id: '3', name: 'たけし', is_host: false, has_described: false, description: null, number: null, is_oni: false },
      ]
    })
  }, [])
  
  const joinDemoRoom = useCallback((code: string, name: string) => {
    setPlayerName(name)
    setDemoState({
      code,
      phase: 'lobby',
      current_round: 0,
      total_rounds: 5,
      total_score: 0,
      rules: { ...DEFAULT_RULES },
      round: null,
      players: [
        { id: '1', name: 'ホスト', is_host: true, has_described: false, description: null, number: null, is_oni: false },
        { id: '2', name, is_host: false, has_described: false, description: null, number: null, is_oni: false },
      ]
    })
  }, [])
  
  const updateRules = useCallback((rules: Partial<GameRules>) => {
    setDemoState(prev => prev ? {
      ...prev,
      rules: { ...prev.rules, ...rules }
    } : null)
  }, [])
  
  const startRound = useCallback((theme: string) => {
    const num = Math.floor(Math.random() * (demoState?.rules.num_range || 100)) + 1
    setMyNumber({ number: num, label: String(num) })
    setLastResult(null)
    
    setDemoState(prev => prev ? {
      ...prev,
      phase: 'describing',
      current_round: prev.current_round + 1,
      round: {
        number: prev.current_round + 1,
        theme,
        ordered_ids: [],
        success: null,
        score: null
      },
      players: prev.players.map(p => ({
        ...p,
        has_described: false,
        description: null,
        number: null
      }))
    } : null)
  }, [demoState?.rules.num_range])
  
  const startOrdering = useCallback(() => {
    setDemoState(prev => prev ? { ...prev, phase: 'ordering' } : null)
  }, [])
  
  const setOrder = useCallback((orderedIds: string[]) => {
    setDemoState(prev => prev ? {
      ...prev,
      phase: 'revealing',
      round: prev.round ? { ...prev.round, ordered_ids: orderedIds } : null
    } : null)
  }, [])
  
  const reveal = useCallback(() => {
    // Just update to show revealed cards - actual revealing handled in component
  }, [])
  
  const score = useCallback(() => {
    setDemoState(prev => {
      if (!prev) return null
      
      // Assign random numbers to players for demo
      const playersWithNumbers = prev.players.map((p, i) => ({
        ...p,
        number: 20 + i * 25 + Math.floor(Math.random() * 20)
      }))
      
      // Check if order is correct
      const orderedIds = prev.round?.ordered_ids || []
      const orderedNumbers = orderedIds.map(id => 
        playersWithNumbers.find(p => p.id === id)?.number || 0
      )
      const isCorrect = orderedNumbers.every((n, i) => 
        i === 0 || orderedNumbers[i - 1] <= n
      )
      
      const roundScore = isCorrect ? playersWithNumbers.length : 0
      setLastResult({ success: isCorrect, score: roundScore })
      
      return {
        ...prev,
        phase: 'round_end',
        total_score: prev.total_score + roundScore,
        round: prev.round ? { 
          ...prev.round, 
          success: isCorrect, 
          score: roundScore 
        } : null,
        players: playersWithNumbers
      }
    })
  }, [])
  
  const nextRound = useCallback(() => {
    setDemoState(prev => {
      if (!prev) return null
      
      if (prev.current_round >= prev.total_rounds) {
        return { ...prev, phase: 'game_over' }
      }
      
      const theme = DEFAULT_THEMES[Math.floor(Math.random() * DEFAULT_THEMES.length)]
      const num = Math.floor(Math.random() * prev.rules.num_range) + 1
      setMyNumber({ number: num, label: String(num) })
      setLastResult(null)
      
      return {
        ...prev,
        phase: 'describing',
        current_round: prev.current_round + 1,
        round: {
          number: prev.current_round + 1,
          theme,
          ordered_ids: [],
          success: null,
          score: null
        },
        players: prev.players.map(p => ({
          ...p,
          has_described: false,
          description: null,
          number: null
        }))
      }
    })
  }, [])
  
  const playAgain = useCallback(() => {
    setDemoState(prev => prev ? {
      ...prev,
      phase: 'lobby',
      current_round: 0,
      total_score: 0,
      round: null,
      players: prev.players.map(p => ({
        ...p,
        has_described: false,
        description: null,
        number: null
      }))
    } : null)
    setMyNumber(null)
    setLastResult(null)
  }, [])
  
  const disconnect = useCallback(() => {
    setDemoState(null)
    setMyNumber(null)
    setLastResult(null)
    setPlayerName(null)
  }, [])
  
  return {
    demoState,
    myNumber,
    lastResult,
    playerName,
    createDemoRoom,
    joinDemoRoom,
    updateRules,
    startRound,
    startOrdering,
    setOrder,
    reveal,
    score,
    nextRound,
    playAgain,
    disconnect
  }
}

function GameContent() {
  const demo = useDemoMode()
  const [isCreating, setIsCreating] = useState(false)
  
  const handleCreateRoom = async () => {
    setIsCreating(true)
    // In demo mode, create immediately
    demo.createDemoRoom('あなた')
    setIsCreating(false)
  }
  
  const handleJoinRoom = async (code: string, name: string) => {
    demo.joinDemoRoom(code, name)
  }
  
  const isHost = demo.demoState?.players[0]?.is_host ?? false
  
  // No game state - show home
  if (!demo.demoState) {
    return (
      <HomeScreen 
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        isCreating={isCreating}
      />
    )
  }
  
  const { phase } = demo.demoState
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phase}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        {phase === 'lobby' && (
          <LobbyScreen
            gameState={demo.demoState}
            isHost={isHost}
            onUpdateRules={demo.updateRules}
            onStartRound={demo.startRound}
          />
        )}
        
        {phase === 'describing' && (
          <DescribingScreen
            gameState={demo.demoState}
            myNumber={demo.myNumber}
            isHost={isHost}
            onStartOrdering={demo.startOrdering}
          />
        )}
        
        {phase === 'ordering' && (
          <OrderingScreen
            gameState={demo.demoState}
            isHost={isHost}
            onSetOrder={demo.setOrder}
          />
        )}
        
        {phase === 'revealing' && (
          <RevealingScreen
            gameState={demo.demoState}
            isHost={isHost}
            onReveal={demo.reveal}
            onScore={demo.score}
          />
        )}
        
        {phase === 'round_end' && (
          <RoundEndScreen
            gameState={demo.demoState}
            lastResult={demo.lastResult}
            isHost={isHost}
            onNextRound={demo.nextRound}
          />
        )}
        
        {phase === 'game_over' && (
          <GameOverScreen
            gameState={demo.demoState}
            onPlayAgain={demo.playAgain}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export function GameScreen() {
  return (
    <GameProvider>
      <div className="max-w-md mx-auto min-h-screen">
        <GameContent />
      </div>
    </GameProvider>
  )
}
