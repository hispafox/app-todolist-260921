interface TaskStatsProps {
  total: number
  pending: number
  completed: number
}

export function TaskStats({ total, pending, completed }: TaskStatsProps) {
  return (
    <div className="mb-4 grid grid-cols-3 gap-3">
      <StatCard value={total} label="Total" />
      <StatCard value={pending} label="Pendientes" />
      <StatCard value={completed} label="Completadas" />
    </div>
  )
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-white/80 px-4 py-4">
      <strong className="mb-1 block text-3xl font-medium leading-none">{value}</strong>
      <span className="font-sans text-[11px] uppercase tracking-[0.08em] text-muted">
        {label}
      </span>
    </div>
  )
}
