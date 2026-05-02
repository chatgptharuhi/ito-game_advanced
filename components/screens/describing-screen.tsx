'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState, MyNumber } from '@/lib/game-types'

interface DescribingScreenProps {
  gameState: GameState
  myNumber: MyNumber | null
  isHost: boolean
  onStartOrdering: () => void
}

export function DescribingScreen({ gameState, myNumber, isHost, onStartOrdering }: DescribingScreenProps) {
  const { round } = gameState

  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Theme Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground mb-2">お題</p>
        <h2 className="text-4xl font-bold text-primary">{round?.theme}</h2>
      </motion.div>

      {/* My Number Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: 180 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="flex-1 flex items-center justify-center"
      >
        <Card className="w-full max-w-xs rounded-3xl border-4 border-primary/30 bg-gradient-to-br from-card to-secondary shadow-2xl">
          <CardContent className="p-10 text-center">
            <p className="text-sm text-muted-foreground mb-2">あなたの数字</p>
            <motion.div
              className="text-8xl font-bold text-primary"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {myNumber?.label || '?'}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-6">
              この数字を「{round?.theme}」で口で例えてね
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Host: 次のフェーズへ */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Button
            onClick={onStartOrdering}
            className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            全員話し終わった → 順番を決める
          </Button>
        </motion.div>
      )}

      {!isHost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center py-4"
        >
          <p className="text-muted-foreground text-sm">口で説明したらホストが次に進めます</p>
        </motion.div>
      )}
    </div>
  )
}
