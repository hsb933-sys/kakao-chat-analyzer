import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { DailyCount } from '../lib/types'
import Card from './Card'

export default function TimelineChart({ data }: { data: DailyCount[] }) {
  const step = Math.max(1, Math.floor(data.length / 8))

  return (
    <Card title="날짜별 메시지 추이" icon="📈">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickFormatter={(v: string) => v.slice(5)}
              interval={step}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
            <Tooltip
              contentStyle={{
                background: '#161b28',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: '#e8ebf3' }}
              formatter={(value) => [`${value}개`, '메시지']}
            />
            <Area type="monotone" dataKey="count" stroke="#fbbf24" strokeWidth={2} fill="url(#fillCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
