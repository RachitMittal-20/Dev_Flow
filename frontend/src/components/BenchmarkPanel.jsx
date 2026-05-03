import StatusPill from "./StatusPill";

export default function BenchmarkPanel({
  items,
  title = "Goals & Benchmarks",
  subtitle = "Benchmarks show whether the current month is comfortably on target or drifting into a watch zone."
}) {
  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          {title}
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.key}
            className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-4"
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="font-medium text-[var(--text-primary)]">
                  {item.label}
                </div>
                <div className="mt-1 text-sm text-[var(--text-secondary)]">
                  {item.currentLabel} now
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={item.status} />
                <span className="rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[var(--text-secondary)]">
                  {item.targetLabel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
