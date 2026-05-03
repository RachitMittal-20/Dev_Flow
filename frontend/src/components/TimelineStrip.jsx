import { formatShortDate } from "../lib/formatters";

const eventMap = {
  issue: {
    icon: "○",
    classes:
      "border-[rgba(79,142,247,0.18)] bg-[rgba(79,142,247,0.12)] text-[var(--accent-blue)]"
  },
  pr: {
    icon: "⇄",
    classes:
      "border-[rgba(167,139,250,0.18)] bg-[rgba(167,139,250,0.12)] text-[var(--accent-purple)]"
  },
  deploy: {
    icon: "↑",
    classes:
      "border-[rgba(62,207,142,0.18)] bg-[rgba(62,207,142,0.12)] text-[var(--accent-green)]"
  },
  bug: {
    icon: "!",
    classes:
      "border-[rgba(245,101,101,0.18)] bg-[rgba(245,101,101,0.12)] text-[var(--accent-red)]"
  },
  quality: {
    icon: "✓",
    classes:
      "border-[rgba(62,207,142,0.18)] bg-[rgba(62,207,142,0.12)] text-[var(--accent-green)]"
  }
};

export default function TimelineStrip({
  items,
  title = "Delivery Timeline",
  subtitle = "A simple sequence of work, review, release, and quality events adds context behind the monthly aggregates."
}) {
  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 space-y-2">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          {title}
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[rgba(232,234,240,0.74)]">
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-4">
          {items.map((item) => {
            const event = eventMap[item.type] || eventMap.issue;

            return (
              <article
                key={`${item.date}-${item.title}`}
                className="w-[260px] shrink-0 rounded-[24px] bg-[rgba(255,255,255,0.03)] p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${event.classes}`}
                  >
                    {event.icon}
                  </span>
                  <span className="rounded-full bg-[rgba(255,255,255,0.04)] px-3 py-1 text-xs text-[rgba(232,234,240,0.7)]">
                    {formatShortDate(item.date)}
                  </span>
                </div>
                <h3 className="text-base font-medium leading-8 text-[rgba(232,234,240,0.96)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[rgba(232,234,240,0.76)]">
                  {item.detail}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
