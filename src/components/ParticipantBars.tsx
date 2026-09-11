import type { ParticipantStats } from '../lib/types'
import Card from './Card'

const COLORS = [
  'from-amber-400 to-amber-500',
  'from-sky-400 to-sky-500',
  'from-fuchsia-400 to-fuchsia-500',
  'from-emerald-400 to-emerald-500',
  'from-rose-400 to-rose-500',
  'from-violet-400 to-violet-500',
]

export default function ParticipantBars({ data }: { data: ParticipantStats[] }) {
  return (
    <Card title="참여자별 메시지 비중" icon="👥">
      <div className="space-y-4">
        {data.map((p, i) => (
          <div key={p.name}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="font-medium text-white">{p.name}</span>
              <span className="text-slate-400">
                {p.count.toLocaleString()}개 · {p.pct.toFixed(1)}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${COLORS[i % COLORS.length]} transition-all duration-700`}
                style={{ width: `${Math.max(p.pct, 1.5)}%` }}
              />
            </div>
            <div className="mt-1 flex gap-4 text-xs text-slate-500">
              <span>평균 {p.avgLength.toFixed(1)}자</span>
              <span>이모지 {p.emojiCount}회</span>
              <span>최다 활동 {p.mostActiveHour}시</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
