export type GamePhase = 'lobby' | 'describing' | 'ordering' | 'revealing' | 'round_end' | 'game_over'

export interface Player {
  id: string
  name: string
  is_host: boolean
  has_described: boolean
  description: string | null
  number: number | null
  is_oni: boolean
}

export interface GameRules {
  num_range: 10 | 50 | 100 | 200
  oni_mode: boolean
  time_limit: 0 | 30 | 60
  total_rounds: 3 | 5 | 7
  custom_themes: string[]
  random_theme: boolean
}

export interface Round {
  number: number
  theme: string
  ordered_ids: string[]
  success: boolean | null
  score: number | null
}

export interface GameState {
  code: string
  phase: GamePhase
  current_round: number
  total_rounds: number
  total_score: number
  rules: GameRules
  round: Round | null
  players: Player[]
}

export interface MyNumber {
  number: number
  label: string
}

// WebSocket message types
export type ServerMessage =
  | { type: 'state'; data: GameState }
  | { type: 'your_number'; number: number; label: string }
  | { type: 'round_result'; success: boolean; score: number }
  | { type: 'player_joined'; name: string }
  | { type: 'player_left'; name: string }
  | { type: 'error'; message: string }

export type ClientMessage =
  | { action: 'describe'; text: string }
  | { action: 'start_round'; theme: string }
  | { action: 'update_rules'; rules: Partial<GameRules> }
  | { action: 'set_order'; ordered_ids: string[] }
  | { action: 'reveal' }
  | { action: 'next_round' }

export const MAX_PLAYERS = 10

export const DEFAULT_RULES: GameRules = {
  num_range: 100,
  oni_mode: false,
  time_limit: 0,
  total_rounds: 5,
  custom_themes: [],
  random_theme: true,
}

export const DEFAULT_THEMES = [
  '甘さ',
  '辛さ',
  '温かさ',
  '柔らかさ',
  '速さ',
  '重さ',
  '明るさ',
  '大きさ',
  '怖さ',
  '美味しさ',
  '人気',
  '高級感',
  '癒し度',
  '懐かしさ',
  'エネルギー',
]
