import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getManagerDetail } from "../api";
import AnomalyPanel from "../components/AnomalyPanel";
import BenchmarkPanel from "../components/BenchmarkPanel";
import ExportActions from "../components/ExportActions";
import MetricCard from "../components/MetricCard";
import MetricTrendChart from "../components/MetricTrendChart";
import MonthToggle from "../components/MonthToggle";
import NextSteps from "../components/NextSteps";
import NotesPanel from "../components/NotesPanel";
import PatternBadge from "../components/PatternBadge";
import TeamDrilldownTable from "../components/TeamDrilldownTable";
import TimelineStrip from "../components/TimelineStrip";
import { formatMonth, formatPercentValue } from "../lib/formatters";
import {
  getBugThreshold,
  getCycleThreshold,
  getLeadThreshold,
  metricDefinitions
} from "../lib/metrics";

const chipClass =
  "rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-[rgba(232,234,240,0.82)]";

function getBenchmark(benchmarks, key) {
  return benchmarks.find((entry) => entry.key === key);
}

export default function ManagerDetailView({
  selectedMonth,
  onSelectMonth,
  months,
  shellLoading,
  shellError
}) {
  const { managerId } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const exportRef = useRef(null);

  useEffect(() => {
    if (!managerId || !selectedMonth) {
      return;
    }

    let isActive = true;

    async function loadDetail() {
      setLoading(true);

      try {
        const payload = await getManagerDetail(managerId, selectedMonth);

        if (isActive) {
          setDetail(payload);
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setDetail(null);
          setError(loadError.message || "Unable to load manager drilldown.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      isActive = false;
    };
  }, [managerId, selectedMonth]);

  const bannerError = shellError || error;
  const manager = detail?.manager;
  const signalBreakdown = manager?.signalBreakdown || [];
  const metricCards = manager
    ? [
        {
          label: "Lead Time",
          value: manager.avg_lead_time_days.toFixed(2),
          unit: "days",
          threshold: getLeadThreshold(manager.avg_lead_time_days),
          definition: metricDefinitions.leadTime,
          comparison: manager.comparisons.leadTime,
          benchmark: getBenchmark(manager.benchmarks, "leadTime")
        },
        {
          label: "Cycle Time",
          value: manager.avg_cycle_time_days.toFixed(2),
          unit: "days",
          threshold: getCycleThreshold(manager.avg_cycle_time_days),
          definition: metricDefinitions.cycleTime,
          comparison: manager.comparisons.cycleTime,
          benchmark: getBenchmark(manager.benchmarks, "cycleTime")
        },
        {
          label: "Bug Rate",
          value: formatPercentValue(manager.avg_bug_rate_pct),
          unit: "%",
          threshold: getBugThreshold(manager.avg_bug_rate_pct),
          definition: metricDefinitions.bugRate,
          comparison: manager.comparisons.bugRate,
          benchmark: getBenchmark(manager.benchmarks, "bugRate")
        }
      ]
    : [];

  const summaryText = manager
    ? `${manager.manager_name} for ${formatMonth(selectedMonth)}. ${manager.summaryNarrative} ${manager.anomalies
        .map((item) => `${item.title}: ${item.detail}`)
        .join(" ")}`
    : "Manager productivity snapshot";

  return (
    <div className="mx-auto max-w-7xl space-y-6" ref={exportRef}>
      {bannerError ? (
        <div className="rounded-2xl border border-[rgba(245,101,101,0.28)] bg-[rgba(245,101,101,0.12)] px-4 py-3 text-sm text-[rgba(255,212,212,0.94)]">
          {bannerError}
        </div>
      ) : null}

      <section className="panel-surface rounded-[32px] p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <Link
                to="/manager"
                className="inline-flex text-sm text-[var(--accent-blue)] transition-colors duration-200 hover:text-white"
              >
                ← Back to manager overview
              </Link>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-secondary)]">
                Team Drilldown
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] lg:text-6xl">
                {manager?.manager_name || "Loading manager"}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[rgba(232,234,240,0.86)]">
                {manager?.summaryNarrative ||
                  "Loading the manager-level story, comparisons, and team drilldown for the selected month."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>{manager?.team_name || "Team"}</span>
              <span className={chipClass}>
                {manager ? `${manager.team_size} developers` : "Team size pending"}
              </span>
              <span className={chipClass}>
                {selectedMonth ? formatMonth(selectedMonth) : "Month pending"}
              </span>
            </div>
          </div>

          <div className="space-y-5 rounded-[28px] bg-[rgba(255,255,255,0.03)] p-5">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Current Signal
              </div>
              <div className="mt-3">
                {manager ? (
                  <PatternBadge pattern={manager.signal} />
                ) : (
                  <div className="skeleton h-10 w-44 rounded-full bg-[rgba(255,255,255,0.1)]" />
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Month Filter
              </div>
              <div className="mt-3">
                <MonthToggle
                  months={months}
                  selectedMonth={selectedMonth}
                  onSelectMonth={onSelectMonth}
                  disabled={shellLoading || months.length === 0}
                />
              </div>
            </div>

            <div className="rounded-[22px] bg-[rgba(255,255,255,0.04)] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Team Signal Mix
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {signalBreakdown.map((entry) => (
                  <span key={entry.label} className={chipClass}>
                    {entry.count} {entry.label}
                  </span>
                ))}
              </div>
            </div>

            <ExportActions
              targetRef={exportRef}
              fileName={`${manager?.manager_name || "manager"}-${selectedMonth || "snapshot"}`}
              summaryText={summaryText}
            />
          </div>
        </div>
      </section>

      {loading ? (
        <section className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <MetricCard
              key={index}
              label="Loading"
              value="--"
              unit=""
              definition="Loading metric definition"
              loading
            />
          ))}
        </section>
      ) : null}

      {manager ? (
        <>
          <section className="grid gap-4 xl:grid-cols-[repeat(3,minmax(0,1fr))_1.15fr]">
            {metricCards.map((card) => (
              <MetricCard key={card.label} {...card} />
            ))}
            <article className="panel-surface rounded-[24px] p-5">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Team Focus
              </div>
              <div className="mt-4 space-y-3">
                {detail.teamMembers.slice(0, 3).map((member) => (
                  <div
                    key={member.developer_id}
                    className="rounded-[18px] bg-[rgba(255,255,255,0.04)] px-3 py-3"
                  >
                    <div className="font-medium text-[var(--text-primary)]">
                      {member.developer_name}
                    </div>
                    <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                      {member.anomalies[0]?.title || member.summaryNarrative}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <AnomalyPanel items={manager.anomalies} />
            <BenchmarkPanel items={manager.benchmarks} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <MetricTrendChart
              data={manager.trendData}
              title="Manager trend"
              description="Lead time and cycle time at the manager level help show whether the team is collectively getting cleaner flow or accumulating friction sprint over sprint."
            />
            <NextSteps steps={detail.recommendedActions} />
          </div>

          <TeamDrilldownTable data={detail.teamMembers} />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <TimelineStrip
              items={detail.activityTimeline}
              title="Team Activity Timeline"
              subtitle="This merged sequence shows how work, review, deployment, and quality events unfolded across the full team during the selected month."
            />
            <NotesPanel
              storageKey={`manager-${managerId}-${selectedMonth}`}
              title="Manager Notes & Actions"
              subtitle="Track follow-ups tied to this manager and month without leaving the dashboard."
              placeholder="Add a team-level follow-up, coaching item, or delivery risk..."
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
