import type { Badge } from '../lib/types'
import Card from './Card'

export default function BadgeGrid({ badges }: { badges: Badge[] }) {
  if (badges.length === 0) return null
  return (
    <Card title="오늘의 칭호" subtitle="대화 데이터로 뽑아본 재미있는 타이틀" icon="🏆">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {badges.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300/20 to-amber-500/10 text-2xl">
              {b.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-medium text-amber-400">{b.title}</div>
              <div className="truncate text-sm font-semibold text-white">{b.name}</div>
              <div className="truncate text-xs text-slate-500">{b.description}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
