export type MessageType = 'text' | 'media' | 'deleted' | 'system'

export interface ChatMessage {
  date: Date
  sender: string
  content: string
  type: MessageType
}

export interface ParticipantStats {
  name: string
  count: number
  pct: number
  avgLength: number
  mediaCount: number
  emojiCount: number
  mostActiveHour: number
}

export interface Badge {
  emoji: string
  title: string
  name: string
  description: string
}

export interface DailyCount {
  date: string
  count: number
}

export interface WordCount {
  word: string
  count: number
}

export interface EmojiCount {
  emoji: string
  count: number
}

export interface ChatStats {
  participants: string[]
  totalMessages: number
  dateRange: { start: Date; end: Date; days: number }
  perParticipant: ParticipantStats[]
  hourlyActivity: number[]
  heatmap: number[][]
  dailyCounts: DailyCount[]
  topWords: WordCount[]
  topEmojis: EmojiCount[]
  mediaCount: number
  deletedCount: number
  nightOwlPct: number
  busiestDay: DailyCount | null
  badges: Badge[]
}
