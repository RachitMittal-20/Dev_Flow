import { useNavigate } from "react-router-dom";
import DeltaPill from "./DeltaPill";
import PatternBadge from "./PatternBadge";
import TrendMiniChart from "./TrendMiniChart";
import { formatDaysLabel, formatPercentLabel } from "../lib/formatters";

export default function ManagerTable({ data }) {
  const navigate = useNavigate();
  const rows = [...data].sort((left, right) =>
    left.manager_name.localeCompare(right.manager_name)
  );

  return (
    <div className="panel-surface overflow-hidden rounded-[28px]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left">
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Manager Name
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Team Size
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Avg Lead Time
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Avg Cycle Time
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Bug Rate
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Trend
              </th>
              <th className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur">
                Signal
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={`${row.manager_id}-${row.month}`}
                className="cursor-pointer transition-colors duration-200 hover:bg-[rgba(79,142,247,0.04)]"
                onClick={() => navigate(`/manager/${row.manager_id}`)}
              >
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {row.manager_name}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {row.team_name}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {row.teamBreakdown.map((entry) => (
                      <span
                        key={entry.label}
                        className="rounded-full bg-[rgba(255,255,255,0.04)] px-2.5 py-1 text-[11px] text-[var(--text-secondary)]"
                      >
                        {entry.count} {entry.label}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 text-[var(--text-secondary)]">
                  {row.team_size}
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatDaysLabel(row.avg_lead_time_days)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={row.comparisons.leadTime} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatDaysLabel(row.avg_cycle_time_days)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={row.comparisons.cycleTime} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatPercentLabel(row.avg_bug_rate_pct)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={row.comparisons.bugRate} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <div className="flex items-center gap-3">
                    <TrendMiniChart
                      values={row.trendData.map((entry) => entry.lead_time)}
                      tone={row.comparisons.leadTime.sentiment}
                    />
                    <div className="text-sm text-[var(--text-secondary)]">
                      {row.comparisons.leadTime.label}
                    </div>
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                  <PatternBadge pattern={row.signal} />
                  <div className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                    {row.summaryNarrative}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
