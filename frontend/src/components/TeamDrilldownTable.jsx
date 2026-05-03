import PatternBadge from "./PatternBadge";
import DeltaPill from "./DeltaPill";
import { formatDaysLabel, formatPercentLabel } from "../lib/formatters";

import { Link } from "react-router-dom";

export default function TeamDrilldownTable({ data }) {
  return (
    <section className="panel-surface overflow-hidden rounded-[28px]">
      <div className="border-b border-[rgba(255,255,255,0.06)] px-6 py-5">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
          Team Drilldown
        </div>
        <h2 className="mt-2 text-2xl font-semibold">
          Every developer in the manager's span
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-separate border-spacing-0">
          <thead>
            <tr className="text-left">
              {[
                "Developer",
                "Lead Time",
                "Cycle Time",
                "PRs",
                "Deployments",
                "Bug Rate",
                "Signal",
                "Primary Change"
              ].map((label) => (
                <th
                  key={label}
                  className="sticky top-0 z-10 bg-[rgba(14,18,31,0.92)] px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur"
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((member) => (
              <tr
                key={`${member.developer_id}-${member.month}`}
                className="group transition-colors duration-200 hover:bg-[rgba(79,142,247,0.04)]"
              >
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {member.developer_name}
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-secondary)]">
                    {member.level} · {member.service_type}
                  </div>
                  <Link
                    to={`/?developer_id=${member.developer_id}&month=${member.month}`}
                    className="mt-3 inline-flex text-sm text-[var(--accent-blue)] transition-colors duration-200 hover:text-white"
                  >
                    Open IC view →
                  </Link>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatDaysLabel(member.avg_lead_time_days)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={member.comparisons.leadTime} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatDaysLabel(member.avg_cycle_time_days)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={member.comparisons.cycleTime} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="metric-value text-[var(--text-primary)]">
                    {member.merged_prs}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={member.comparisons.prThroughput} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="metric-value text-[var(--text-primary)]">
                    {member.prod_deployments}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={member.comparisons.deployments} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="metric-value text-[var(--text-primary)]">
                    {formatPercentLabel(member.bug_rate_pct)}
                  </div>
                  <div className="mt-2">
                    <DeltaPill comparison={member.comparisons.bugRate} compact />
                  </div>
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <PatternBadge pattern={member.pattern_hint} />
                </td>
                <td className="border-t border-[rgba(255,255,255,0.06)] px-6 py-5 align-top">
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {member.anomalies[0]?.title || "Stable month"}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {member.anomalies[0]?.detail || member.summaryNarrative}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
