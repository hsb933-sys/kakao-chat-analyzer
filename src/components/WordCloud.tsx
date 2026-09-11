import type { WordCount } from '../lib/types'
import Card from './Card'

const PALETTE = ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa', '#fb923c', '#f87171']

export default function WordCloud({ words }: { words: WordCount[] }) {
  if (words.length === 0) return null
  const max = Math.max(...words.map((w) => w.count))
  const min = Math.min(...words.map((w) => w.count))

  const scale = (count: number) => {
    if (max === min) return 18
    const t = (count - min) / (max - min)
    return 13 + t * 26
  }

  return (
    <Card title="자주 쓴 단어" subtitle="많이 언급될수록 크게 표시돼요" icon="🔤">
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 py-2">
        {words.map((w, i) => (
          <span
            key={w.word}
            title={`${w.count}회`}
            style={{ fontSize: `${scale(w.count)}px`, color: PALETTE[i % PALETTE.length] }}
            className="font-semibold leading-none transition-transform hover:scale-110"
          >
            {w.word}
          </span>
        ))}
      </div>
    </Card>
  )
}
