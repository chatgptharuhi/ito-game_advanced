'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState } from '@/lib/game-types'
import { CheckCircle, XCircle, Trophy } from 'lucide-react'

interface RoundEndScreenProps {
  gameState: GameState
  lastResult: { success: boolean; score: number } | null
  isHost: boolean
  onNextRound: () => void
}

export function RoundEndScreen({ gameState, lastResult, isHost, onNextRound }: RoundEndScreenProps) {
  const { round, players, total_score, current_round, total_rounds } = gameState
  const success = lastResult?.success ?? round?.success ?? false
  const roundScore = lastResult?.score ?? round?.score ?? 0
  
  // Get players sorted by actual number
  const sortedPlayers = [...players].sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
  
  // Get the order that was guessed
  const orderedPlayers = round?.ordered_ids
    .map(id => players.find(p => p.id === id))
    .filter(Boolean) || []
  
  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Result Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        {success ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={64} className="text-success" />
            </div>
            <h2 className="text-4xl font-bold text-success">成功！</h2>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <XCircle size={64} className="text-destructive" />
            </div>
            <h2 className="text-4xl font-bold text-destructive">失敗...</h2>
          </motion.div>
        )}
        
        <p className="text-muted-foreground mt-2">お題: {round?.theme}</p>
      </motion.div>
      
      {/* Score Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="rounded-2xl border-2 border-border/50 bg-card/80 mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">今回の得点</p>
                <p className="text-3xl font-bold text-primary">+{roundScore}</p>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">合計得点</p>
                <div className="flex items-center justify-center gap-2">
                  <Trophy size={20} className="text-amber-500" />
                  <p className="text-3xl font-bold">{total_score}</p>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              ラウンド {current_round} / {total_rounds}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Correct Order */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex-1 overflow-y-auto"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          正しい順番
        </h3>
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const guessedIndex = orderedPlayers.findIndex(p => p?.id === player.id)
            const isCorrectPosition = guessedIndex === index
            
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                <Card className={`rounded-xl border-2 ${
                  isCorrectPosition ? 'border-success/50 bg-success/5' : 'border-destructive/30 bg-destructive/5'
                }`}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      isCorrectPosition ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        {!isCorrectPosition && (
                          <span className="text-xs text-muted-foreground">
                            (予想: {guessedIndex + 1}位)
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-12 h-14 rounded-lg bg-primary flex items-center justify-center shadow">
                      <span className="text-xl font-bold text-primary-foreground">
                        {player.number}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
      
      {/* Next Round Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        {isHost ? (
          <Button
            onClick={onNextRound}
            className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            {current_round < total_rounds ? '次のラウンドへ' : '結果を見る'}
          </Button>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">
              ホストが次のラウンドを開始するのを待っています...
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
