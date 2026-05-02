'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState } from '@/lib/game-types'
import { Eye } from 'lucide-react'

interface RevealingScreenProps {
  gameState: GameState
  isHost: boolean
  onReveal: () => void
  onScore: () => void
}

export function RevealingScreen({ gameState, isHost, onReveal, onScore }: RevealingScreenProps) {
  const { round, players } = gameState
  const [revealedCount, setRevealedCount] = useState(0)
  
  // Get players in the ordered sequence
  const orderedPlayers = round?.ordered_ids
    .map(id => players.find(p => p.id === id))
    .filter(Boolean) || players
  
  const handleReveal = () => {
    if (revealedCount < orderedPlayers.length) {
      setRevealedCount(prev => prev + 1)
      onReveal()
    }
  }
  
  const allRevealed = revealedCount >= orderedPlayers.length
  
  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground mb-2">お題: {round?.theme}</p>
        <h2 className="text-2xl font-bold text-primary">カードをめくろう</h2>
        <p className="text-sm text-muted-foreground mt-2">
          {allRevealed ? '全員のカードが公開されました！' : `${revealedCount}/${orderedPlayers.length} 枚公開`}
        </p>
      </motion.div>
      
      {/* Card Stack */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          <AnimatePresence>
            {orderedPlayers.map((player, index) => {
              const isRevealed = index < revealedCount
              
              return (
                <motion.div
                  key={player?.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AnimatePresence mode="wait">
                    {!isRevealed ? (
                      <motion.div
                        key="back"
                        exit={{ rotateY: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="rounded-2xl border-4 border-primary/30 bg-gradient-to-br from-primary/20 to-accent/20">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                              <span className="text-2xl font-bold text-primary">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-lg">{player?.name}</p>
                            </div>
                            <div className="w-16 h-20 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-dashed border-primary/30">
                              <span className="text-3xl text-primary/40">?</span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="front"
                        initial={{ rotateY: -90, opacity: 0 }}
                        animate={{ rotateY: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="rounded-2xl border-4 border-success/50 bg-gradient-to-br from-card to-success/10">
                          <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-success/20 flex items-center justify-center">
                              <span className="text-2xl font-bold text-success">{index + 1}</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-lg">{player?.name}</p>
                            </div>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2, type: 'spring' }}
                              className="w-16 h-20 rounded-xl bg-primary flex items-center justify-center shadow-lg"
                            >
                              <span className="text-3xl font-bold text-primary-foreground">
                                {player?.number ?? '?'}
                              </span>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 space-y-3"
      >
        {isHost ? (
          <>
            {!allRevealed ? (
              <Button
                onClick={handleReveal}
                className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center gap-3"
              >
                <Eye size={24} />
                次のカードをめくる
              </Button>
            ) : (
              <Button
                onClick={onScore}
                className="w-full h-16 text-xl font-medium rounded-2xl bg-success hover:bg-success/90 text-success-foreground shadow-lg"
              >
                採点する
              </Button>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              {allRevealed ? 'ホストが採点するのを待っています...' : 'ホストがカードをめくっています...'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
