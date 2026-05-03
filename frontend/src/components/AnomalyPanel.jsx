const toneMap = {
  positive: {
    label: "Improved",
    classes:
      "border-[rgba(62,207,142,0.18)] bg-[rgba(62,207,142,0.12)] text-[var(--accent-green)]"
  },
  negative: {
    label: "Attention",
    classes:
      "border-[rgba(245,101,101,0.18)] bg-[rgba(245,101,101,0.12)] text-[var(--accent-red)]"
  },
  neutral: {
    label: "Steady",
    classes:
      "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]"
  }
};

export default function AnomalyPanel({
  items,
  title = "What Changed",
  subtitle = "These callouts summarize the clearest month-over-month shifts so the dashboard explains why the numbers feel different."
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
        {items.map((item) => {
          const tone = toneMap[item.tone] || toneMap.neutral;

          return (
            <article
              key={`${item.title}-${item.detail}`}
              className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium text-[var(--text-primary)]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">
                    {item.detail}
                  </p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${tone.classes}`}
                >
                  {tone.label}
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
