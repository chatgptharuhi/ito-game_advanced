'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface HomeScreenProps {
  onCreateRoom: () => void
  onJoinRoom: (code: string, name: string) => void
  isCreating?: boolean
}

export function HomeScreen({ onCreateRoom, onJoinRoom, isCreating }: HomeScreenProps) {
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [playerName, setPlayerName] = useState('')
  
  const handleJoin = () => {
    if (roomCode.length === 5 && playerName.trim()) {
      onJoinRoom(roomCode.toUpperCase(), playerName.trim())
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 craft-paper">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl font-bold text-primary mb-2 tracking-wider">糸</h1>
        <p className="text-lg text-muted-foreground">Ito - 言葉で繋ぐカードゲーム</p>
      </motion.div>
      
      {!showJoinForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-sm space-y-4"
        >
          <Button
            onClick={onCreateRoom}
            disabled={isCreating}
            className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            {isCreating ? '作成中...' : '部屋を作る'}
          </Button>
          
          <Button
            onClick={() => setShowJoinForm(true)}
            variant="secondary"
            className="w-full h-16 text-xl font-medium rounded-2xl shadow-lg"
          >
            部屋に入る
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <Card className="border-2 border-border/50 shadow-xl rounded-3xl bg-card/80 backdrop-blur">
            <CardContent className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  ルームコード（5文字）
                </label>
                <Input
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="ABCDE"
                  className="h-14 text-center text-2xl font-mono tracking-[0.5em] rounded-xl bg-input border-2"
                  maxLength={5}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  あなたの名前
                </label>
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="名前を入力"
                  className="h-14 text-lg rounded-xl bg-input border-2"
                  maxLength={12}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setShowJoinForm(false)}
                  variant="outline"
                  className="flex-1 h-14 text-lg rounded-xl"
                >
                  戻る
                </Button>
                <Button
                  onClick={handleJoin}
                  disabled={roomCode.length !== 5 || !playerName.trim()}
                  className="flex-1 h-14 text-lg rounded-xl bg-primary hover:bg-primary/90"
                >
                  入室
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ThreadIcon />
          <span className="text-sm">数字を言葉で伝えよう</span>
        </div>
      </motion.div>
    </div>
  )
}

function ThreadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
      <path
        d="M4 4C4 4 8 8 12 12C16 16 20 20 20 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 4C20 4 16 8 12 12C8 16 4 20 4 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}
