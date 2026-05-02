'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState } from '@/lib/game-types'
import { Trophy, Star, RotateCcw } from 'lucide-react'

interface GameOverScreenProps {
  gameState: GameState
  onPlayAgain: () => void
}

export function GameOverScreen({ gameState, onPlayAgain }: GameOverScreenProps) {
  const { total_score, total_rounds, players } = gameState
  
  // Calculate max possible score (assuming all correct = players.length points per round)
  const maxScore = total_rounds * players.length
  const percentage = Math.round((total_score / maxScore) * 100)
  
  // Determine rating based on percentage
  const getRating = () => {
    if (percentage >= 90) return { stars: 3, message: '素晴らしい！', color: 'text-amber-500' }
    if (percentage >= 70) return { stars: 2, message: 'よくできました！', color: 'text-success' }
    if (percentage >= 50) return { stars: 1, message: 'まあまあ！', color: 'text-primary' }
    return { stars: 0, message: '次はきっと！', color: 'text-muted-foreground' }
  }
  
  const rating = getRating()
  
  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Confetti effect placeholder */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: -20, 
              x: Math.random() * 400, 
              rotate: 0,
              opacity: 1 
            }}
            animate={{ 
              y: 800, 
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3
            }}
            className="absolute w-3 h-3 rounded-sm"
            style={{ 
              backgroundColor: ['#c77b58', '#8b5e3c', '#d4a574', '#e8d5c4'][Math.floor(Math.random() * 4)],
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>
      
      {/* Result Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.3 }}
          className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl"
        >
          <Trophy size={56} className="text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-primary mb-2">ゲーム終了！</h1>
        <p className={`text-2xl font-medium ${rating.color}`}>{rating.message}</p>
        
        {/* Stars */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: i < rating.stars ? 1 : 0.6, 
                rotate: 0,
                opacity: i < rating.stars ? 1 : 0.3
              }}
              transition={{ delay: 0.5 + i * 0.15, type: 'spring' }}
            >
              <Star 
                size={40} 
                className={i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'} 
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Final Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="relative z-10"
      >
        <Card className="rounded-3xl border-4 border-primary/30 bg-gradient-to-br from-card to-secondary shadow-2xl">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">最終スコア</p>
            <motion.div 
              className="text-6xl font-bold text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            >
              {total_score}
            </motion.div>
            <p className="text-muted-foreground mt-2">
              {total_rounds}ラウンド中
            </p>
            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-around">
                <div>
                  <p className="text-2xl font-bold">{players.length}</p>
                  <p className="text-xs text-muted-foreground">人数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{percentage}%</p>
                  <p className="text-xs text-muted-foreground">正解率</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{maxScore}</p>
                  <p className="text-xs text-muted-foreground">最大スコア</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Players */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex-1 py-6 relative z-10"
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3 text-center">
          参加者
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {players.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="px-4 py-2 rounded-full bg-secondary flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {player.name.charAt(0)}
              </div>
              <span className="font-medium">{player.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
      
      {/* Play Again Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10"
      >
        <Button
          onClick={onPlayAgain}
          className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg flex items-center justify-center gap-3"
        >
          <RotateCcw size={24} />
          もう一度遊ぶ
        </Button>
      </motion.div>
    </div>
  )
}
