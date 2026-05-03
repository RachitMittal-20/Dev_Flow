export default function NextSteps({ steps }) {
  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          Suggested next steps
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          Action suggestions stay constrained and practical so the dashboard
          points to likely next moves without overwhelming the reader.
        </p>
      </div>
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={step}
            className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-4 transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(79,142,247,0.28)] bg-[rgba(79,142,247,0.16)] text-sm font-semibold text-[var(--accent-blue)]">
                {index + 1}
              </span>
              <p className="pt-1 text-sm leading-6 text-[var(--text-secondary)]">
                {step}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
