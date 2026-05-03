export default function InsightPanel({ items }) {
  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          What the metrics are saying
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
          These are the interpretation notes coming directly from the API, so
          the written story stays tied to the same logic as the underlying
          metrics.
        </p>
      </div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-[22px] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-sm leading-7 text-[rgba(232,234,240,0.82)]"
          >
            <div className="border-l-2 border-[rgba(79,142,247,0.75)] pl-4">
              {item}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
