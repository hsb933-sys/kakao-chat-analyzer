import type { ChatStats } from '../lib/types'
import ActivityHeatmap from './ActivityHeatmap'
import BadgeGrid from './BadgeGrid'
import EmojiGrid from './EmojiGrid'
import ParticipantBars from './ParticipantBars'
import StatHero from './StatHero'
import TimelineChart from './TimelineChart'
import WordCloud from './WordCloud'

interface Props {
  stats: ChatStats
  filename: string
  onReset: () => void
}

export default function Dashboard({ stats, filename, onReset }: Props) {
  return (
    <div className="min-h-screen bg-[#0b0f1a] pb-20">
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">💬</span>
            <span className="font-semibold text-white">카톡 대화 분석기</span>
            <span className="hidden truncate text-xs text-slate-500 sm:inline">· {filename}</span>
          </div>
          <button
            onClick={onReset}
            className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10"
          >
            다른 파일 분석하기
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl space-y-6 px-6 pt-8">
        <StatHero stats={stats} />
        <BadgeGrid badges={stats.badges} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ParticipantBars data={stats.perParticipant} />
          <EmojiGrid emojis={stats.topEmojis} />
        </div>

        <TimelineChart data={stats.dailyCounts} />
        <ActivityHeatmap heatmap={stats.heatmap} />
        <WordCloud words={stats.topWords} />

        <p className="pt-4 text-center text-xs text-slate-600">
          모든 분석은 이 브라우저 안에서만 실행되며, 어떤 대화 내용도 서버로 전송되지 않습니다.
        </p>
      </div>
    </div>
  )
}
