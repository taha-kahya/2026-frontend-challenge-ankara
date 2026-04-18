interface SuspicionBarProps {
  score: number
  max?: number
  showScore?: boolean
}

export function SuspicionBar({ score, max = 20, showScore = true }: SuspicionBarProps) {
  const pct = Math.min((score / max) * 100, 100)
  const color =
    pct > 66 ? 'bg-red-500' :
    pct > 33 ? 'bg-amber-400' :
    'bg-emerald-500'
  const glow =
    pct > 66 ? 'shadow-red-500/40' :
    pct > 33 ? 'shadow-amber-400/40' :
    'shadow-emerald-500/30'

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/8 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} shadow-sm ${glow} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showScore && (
        <span className="font-mono text-xs text-[--color-text-dim] w-4 text-right">{score}</span>
      )}
    </div>
  )
}
