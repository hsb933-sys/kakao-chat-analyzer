import type { PropsWithChildren, ReactNode } from 'react'

interface Props extends PropsWithChildren {
  title?: string
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export default function Card({ title, subtitle, icon, className = '', children }: Props) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/20 backdrop-blur-sm sm:p-6 ${className}`}
    >
      {title && (
        <div className="mb-4 flex items-center gap-2">
          {icon && <span className="text-lg">{icon}</span>}
          <div>
            <h3 className="text-sm font-semibold text-white sm:text-base">{title}</h3>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
