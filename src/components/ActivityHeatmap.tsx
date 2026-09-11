import { Fragment } from 'react'
import Card from './Card'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function ActivityHeatmap({ heatmap }: { heatmap: number[][] }) {
  const max = Math.max(1, ...heatmap.flat())

  return (
    <Card title="시간대별 활동" subtitle="요일 x 시간별 메시지 빈도" icon="🔥">
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[2rem_repeat(24,1fr)] gap-[3px]">
            <div />
            {Array.from({ length: 24 }, (_, h) => (
              <div key={h} className="text-center text-[9px] text-slate-600">
                {h % 3 === 0 ? h : ''}
              </div>
            ))}
            {WEEKDAYS.map((wd, wi) => (
              <Fragment key={wd}>
                <div className="flex items-center text-xs text-slate-500">{wd}</div>
                {heatmap[wi].map((v, h) => {
                  const intensity = v / max
                  return (
                    <div
                      key={`${wd}-${h}`}
                      title={`${wd}요일 ${h}시: ${v}건`}
                      className="aspect-square rounded-[3px]"
                      style={{
                        background:
                          v === 0
                            ? 'rgba(255,255,255,0.04)'
                            : `rgba(251, 191, 36, ${0.15 + intensity * 0.85})`,
                      }}
                    />
                  )
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
