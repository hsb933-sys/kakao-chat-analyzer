import type { ChatStats } from '../lib/types'

interface Props {
  stats: ChatStats
}

function formatDate(d: Date) {
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

export default function StatHero({ stats }: Props) {
  const items = [
    { label: '전체 메시지', value: stats.totalMessages.toLocaleString(), suffix: '개' },
    { label: '참여 인원', value: stats.participants.length.toLocaleString(), suffix: '명' },
    { label: '대화 기간', value: stats.dateRange.days.toLocaleString(), suffix: '일' },
    { label: '사진·동영상', value: stats.mediaCount.toLocaleString(), suffix: '개' },
  ]

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-400/10 via-white/[0.03] to-transparent p-6 sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">
        {formatDate(stats.dateRange.start)} ~ {formatDate(stats.dateRange.end)}
      </p>
      <div className="mt-5 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {items.map((it) => (
          <div key={it.label}>
            <div className="text-2xl font-bold text-white sm:text-3xl">
              {it.value}
              <span className="ml-1 text-sm font-normal text-slate-400">{it.suffix}</span>
            </div>
            <div className="mt-1 text-xs text-slate-500 sm:text-sm">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
