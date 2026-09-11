import type { EmojiCount } from '../lib/types'
import Card from './Card'

export default function EmojiGrid({ emojis }: { emojis: EmojiCount[] }) {
  if (emojis.length === 0) return null
  const max = Math.max(...emojis.map((e) => e.count))

  return (
    <Card title="자주 쓴 이모지" icon="😄">
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
        {emojis.map((e) => (
          <div key={e.emoji} className="flex flex-col items-center gap-1 rounded-xl bg-white/[0.03] py-3">
            <span
              className="leading-none"
              style={{ fontSize: `${18 + (e.count / max) * 18}px` }}
            >
              {e.emoji}
            </span>
            <span className="text-[11px] text-slate-500">{e.count}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
