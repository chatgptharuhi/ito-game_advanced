'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { GameState, GameRules, DEFAULT_THEMES, MAX_PLAYERS } from '@/lib/game-types'
import { Users, Settings, Plus, X, Crown } from 'lucide-react'

interface LobbyScreenProps {
  gameState: GameState
  isHost: boolean
  onUpdateRules: (rules: Partial<GameRules>) => void
  onStartRound: (theme: string) => void
}

export function LobbyScreen({ gameState, isHost, onUpdateRules, onStartRound }: LobbyScreenProps) {
  const [showSettings, setShowSettings] = useState(false)
  const [customTheme, setCustomTheme] = useState('')
  const [selectedTheme, setSelectedTheme] = useState('')
  
  const { rules, players, code } = gameState
  const allThemes = [...DEFAULT_THEMES, ...rules.custom_themes]
  
  const handleAddCustomTheme = () => {
    if (customTheme.trim() && !rules.custom_themes.includes(customTheme.trim())) {
      onUpdateRules({
        custom_themes: [...rules.custom_themes, customTheme.trim()]
      })
      setCustomTheme('')
    }
  }
  
  const handleRemoveCustomTheme = (theme: string) => {
    onUpdateRules({
      custom_themes: rules.custom_themes.filter(t => t !== theme)
    })
  }
  
  const handleStart = () => {
    const theme = rules.random_theme 
      ? allThemes[Math.floor(Math.random() * allThemes.length)]
      : selectedTheme || allThemes[0]
    onStartRound(theme)
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Room Code Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground mb-1">ルームコード</p>
        <div className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">
          {code}
        </div>
        <p className="text-xs text-muted-foreground mt-2">友達に共有しよう</p>
      </motion.div>
      
      {/* Players List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex-1"
      >
        <Card className="rounded-3xl border-2 border-border/50 bg-card/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users size={18} />
                <span className="text-sm font-medium">参加者</span>
              </div>
              <span className={`text-sm font-bold ${players.length >= MAX_PLAYERS ? 'text-destructive' : 'text-primary'}`}>
                {players.length} / {MAX_PLAYERS}人
              </span>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence>
                {players.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {player.name.charAt(0)}
                    </div>
                    <span className="font-medium flex-1">{player.name}</span>
                    {player.is_host && (
                      <Crown size={18} className="text-amber-500" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Host Controls */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 space-y-3"
        >
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="outline"
            className="w-full h-14 text-lg rounded-2xl flex items-center justify-center gap-2"
          >
            <Settings size={20} />
            ゲーム設定
          </Button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="rounded-2xl border-2 border-border/50 bg-card/80">
                  <CardContent className="p-4 space-y-4">
                    {/* Number Range */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        数字の範囲
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {([10, 50, 100, 200] as const).map(range => (
                          <Button
                            key={range}
                            variant={rules.num_range === range ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onUpdateRules({ num_range: range })}
                            className="rounded-xl"
                          >
                            1-{range}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Total Rounds */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        ラウンド数
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {([3, 5, 7] as const).map(rounds => (
                          <Button
                            key={rounds}
                            variant={rules.total_rounds === rounds ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onUpdateRules({ total_rounds: rounds })}
                            className="rounded-xl"
                          >
                            {rounds}回
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Oni Mode */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">鬼モード</span>
                      <Switch
                        checked={rules.oni_mode}
                        onCheckedChange={(checked) => onUpdateRules({ oni_mode: checked })}
                      />
                    </div>
                    
                    {/* Random Theme Toggle */}
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm font-medium">お題をランダムにする</span>
                      <Switch
                        checked={rules.random_theme}
                        onCheckedChange={(checked) => onUpdateRules({ random_theme: checked })}
                      />
                    </div>
                    
                    {/* Theme Selection (if not random) */}
                    {!rules.random_theme && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                          お題を選択
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {allThemes.map(theme => (
                            <Button
                              key={theme}
                              variant={selectedTheme === theme ? 'default' : 'outline'}
                              size="sm"
                              onClick={() => setSelectedTheme(theme)}
                              className="rounded-full"
                            >
                              {theme}
                              {rules.custom_themes.includes(theme) && (
                                <X 
                                  size={14} 
                                  className="ml-1 cursor-pointer"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveCustomTheme(theme)
                                  }}
                                />
                              )}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Custom Theme Input */}
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-2 block">
                        カスタムお題を追加
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={customTheme}
                          onChange={(e) => setCustomTheme(e.target.value)}
                          placeholder="新しいお題"
                          className="flex-1 rounded-xl"
                          onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTheme()}
                        />
                        <Button
                          onClick={handleAddCustomTheme}
                          size="icon"
                          className="rounded-xl"
                          disabled={!customTheme.trim()}
                        >
                          <Plus size={20} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button
            onClick={handleStart}
            disabled={players.length < 2 || players.length > MAX_PLAYERS}
            className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            ラウンド開始
          </Button>

          {players.length < 2 && (
            <p className="text-center text-sm text-muted-foreground">
              2人以上必要です
            </p>
          )}
          {players.length > MAX_PLAYERS && (
            <p className="text-center text-sm text-destructive">
              参加者が多すぎます（最大{MAX_PLAYERS}人）
            </p>
          )}
        </motion.div>
      )}
      
      {/* Non-host waiting message */}
      {!isHost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center py-8"
        >
          <p className="text-muted-foreground">ホストがゲームを開始するのを待っています...</p>
        </motion.div>
      )}
    </div>
  )
}
