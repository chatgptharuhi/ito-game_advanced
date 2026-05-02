'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { GameState } from '@/lib/game-types'
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface OrderingScreenProps {
  gameState: GameState
  isHost: boolean
  onSetOrder: (orderedIds: string[]) => void
}

interface SortablePlayerProps {
  player: {
    id: string
    name: string
    description: string | null
  }
  index: number
  isHost: boolean
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

function SortablePlayer({ player, index, isHost, onMoveUp, onMoveDown, isFirst, isLast }: SortablePlayerProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: player.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  }
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`${isDragging ? 'opacity-80' : ''}`}
    >
      <Card className={`rounded-2xl border-2 ${isDragging ? 'border-primary shadow-xl' : 'border-border/50'} bg-card`}>
        <CardContent className="p-4 flex items-center gap-3">
          {isHost && (
            <div className="flex flex-col gap-1">
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="p-1 rounded hover:bg-secondary disabled:opacity-30"
              >
                <ArrowUp size={16} />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="p-1 rounded hover:bg-secondary disabled:opacity-30"
              >
                <ArrowDown size={16} />
              </button>
            </div>
          )}
          
          {isHost && (
            <div 
              {...attributes} 
              {...listeners}
              className="cursor-grab active:cursor-grabbing touch-none"
            >
              <GripVertical size={20} className="text-muted-foreground" />
            </div>
          )}
          
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              {index + 1}
            </span>
            <span className="font-medium truncate">{player.name}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function OrderingScreen({ gameState, isHost, onSetOrder }: OrderingScreenProps) {
  const { round, players } = gameState
  const [orderedPlayers, setOrderedPlayers] = useState(
    players.map(p => ({ id: p.id, name: p.name, description: p.description }))
  )
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )
  
  useEffect(() => {
    setOrderedPlayers(
      players.map(p => ({ id: p.id, name: p.name, description: p.description }))
    )
  }, [players])
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (over && active.id !== over.id) {
      setOrderedPlayers((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id)
        const newIndex = items.findIndex(i => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }
  
  const movePlayer = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < orderedPlayers.length) {
      setOrderedPlayers(arrayMove(orderedPlayers, index, newIndex))
    }
  }
  
  const handleConfirm = () => {
    onSetOrder(orderedPlayers.map(p => p.id))
  }
  
  return (
    <div className="min-h-screen flex flex-col p-4 craft-paper">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-6"
      >
        <p className="text-sm text-muted-foreground mb-2">お題: {round?.theme}</p>
        <h2 className="text-2xl font-bold text-primary">順番を決めよう</h2>
        <p className="text-sm text-muted-foreground mt-2">
          小さい順に並べてね（上が小さい）
        </p>
      </motion.div>
      
      {/* Sortable List */}
      <div className="flex-1 overflow-y-auto">
        {isHost ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedPlayers.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {orderedPlayers.map((player, index) => (
                  <SortablePlayer
                    key={player.id}
                    player={player}
                    index={index}
                    isHost={isHost}
                    onMoveUp={() => movePlayer(index, 'up')}
                    onMoveDown={() => movePlayer(index, 'down')}
                    isFirst={index === 0}
                    isLast={index === orderedPlayers.length - 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {orderedPlayers.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border-2 border-border/50 bg-card">
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{player.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Confirm Button (Host only) */}
      {isHost ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <Button
            onClick={handleConfirm}
            className="w-full h-16 text-xl font-medium rounded-2xl bg-primary hover:bg-primary/90 shadow-lg"
          >
            この順番で決定
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-center py-4"
        >
          <p className="text-muted-foreground">ホストが順番を決めています...</p>
        </motion.div>
      )}
    </div>
  )
}
