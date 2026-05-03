import { useEffect, useRef, useState } from "react";
import { getICMetrics } from "../api";
import AnomalyPanel from "../components/AnomalyPanel";
import BenchmarkPanel from "../components/BenchmarkPanel";
import ExportActions from "../components/ExportActions";
import InsightPanel from "../components/InsightPanel";
import MetricCard from "../components/MetricCard";
import MetricTrendChart from "../components/MetricTrendChart";
import NextSteps from "../components/NextSteps";
import NotesPanel from "../components/NotesPanel";
import PatternBadge from "../components/PatternBadge";
import TimelineStrip from "../components/TimelineStrip";
import { formatMonth, formatPercentValue } from "../lib/formatters";
import {
  getBugThreshold,
  getCycleThreshold,
  getLeadThreshold,
  getThroughputThreshold,
  metricDefinitions
} from "../lib/metrics";

const metaChipClass =
  "rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-[rgba(232,234,240,0.82)]";

function getBenchmark(benchmarks, key) {
  return benchmarks.find((entry) => entry.key === key);
}

export default function ICView({
  developers,
  selectedDeveloperId,
  selectedMonth,
  shellLoading,
  shellError
}) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const exportRef = useRef(null);

  const selectedDeveloper = developers.find(
    (developer) => developer.developer_id === selectedDeveloperId
  );

  useEffect(() => {
    if (!selectedDeveloperId || !selectedMonth) {
      return;
    }

    let isActive = true;

    async function loadMetrics() {
      setLoading(true);
      setMetrics(null);

      try {
        const payload = await getICMetrics(selectedDeveloperId, selectedMonth);

        if (isActive) {
          setMetrics(payload);
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setMetrics(null);
          setError(loadError.message || "Unable to load productivity data.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadMetrics();

    return () => {
      isActive = false;
    };
  }, [selectedDeveloperId, selectedMonth]);

  const bannerError =
    shellError || (error && error !== "Not found" ? error : "");
  const metricCards = metrics
    ? [
        {
          label: "Lead Time",
          value: metrics.avg_lead_time_days.toFixed(2),
          unit: "days",
          threshold: getLeadThreshold(metrics.avg_lead_time_days),
          definition: metricDefinitions.leadTime,
          comparison: metrics.comparisons.leadTime,
          benchmark: getBenchmark(metrics.benchmarks, "leadTime")
        },
        {
          label: "Cycle Time",
          value: metrics.avg_cycle_time_days.toFixed(2),
          unit: "days",
          threshold: getCycleThreshold(metrics.avg_cycle_time_days),
          definition: metricDefinitions.cycleTime,
          comparison: metrics.comparisons.cycleTime,
          benchmark: getBenchmark(metrics.benchmarks, "cycleTime")
        },
        {
          label: "PR Throughput",
          value: metrics.merged_prs,
          unit: "count",
          threshold: getThroughputThreshold(metrics.merged_prs),
          definition: metricDefinitions.prThroughput,
          comparison: metrics.comparisons.prThroughput,
          benchmark: getBenchmark(metrics.benchmarks, "prThroughput")
        },
        {
          label: "Deployment Frequency",
          value: metrics.prod_deployments,
          unit: "count",
          threshold: getThroughputThreshold(metrics.prod_deployments),
          definition: metricDefinitions.deployments,
          comparison: metrics.comparisons.deployments,
          benchmark: getBenchmark(metrics.benchmarks, "deployments")
        },
        {
          label: "Bug Rate",
          value: formatPercentValue(metrics.bug_rate_pct),
          unit: "%",
          threshold: getBugThreshold(metrics.bug_rate_pct),
          definition: metricDefinitions.bugRate,
          comparison: metrics.comparisons.bugRate,
          benchmark: getBenchmark(metrics.benchmarks, "bugRate")
        }
      ]
    : [];

  const summaryText = metrics
    ? `${selectedDeveloper?.developer_name || "Developer"} for ${formatMonth(
        selectedMonth
      )}. ${metrics.summaryNarrative} ${metrics.anomalies
        .map((entry) => `${entry.title}: ${entry.detail}`)
        .join(" ")}`
    : "Developer productivity snapshot";

  return (
    <div className="mx-auto max-w-7xl space-y-6" ref={exportRef}>
      {bannerError ? (
        <div className="rounded-2xl border border-[rgba(245,101,101,0.28)] bg-[rgba(245,101,101,0.12)] px-4 py-3 text-sm text-[rgba(255,212,212,0.94)]">
          {bannerError}
        </div>
      ) : null}

      <section className="panel-surface overflow-hidden rounded-[32px] p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-secondary)]">
                Developer Snapshot
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] lg:text-6xl">
                {selectedDeveloper?.developer_name || "Loading developer"}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[rgba(232,234,240,0.86)]">
                {metrics?.summaryNarrative ||
                  "Pulling together a sharper view of delivery speed, release cadence, and quality for the selected month."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={metaChipClass}>
                {selectedDeveloper?.team_name || "Team pending"}
              </span>
              <span className={metaChipClass}>
                {selectedDeveloper?.level || "Level pending"}
              </span>
              <span className={metaChipClass}>
                {selectedDeveloper?.service_type || "Service pending"}
              </span>
              <span className={metaChipClass}>
                {selectedDeveloper?.manager_name || "Manager pending"}
              </span>
              <span className={metaChipClass}>
                {selectedMonth ? formatMonth(selectedMonth) : "Month pending"}
              </span>
            </div>
          </div>

          <div className="rounded-[28px] bg-[linear-gradient(180deg,rgba(79,142,247,0.14),rgba(255,255,255,0.02))] p-5">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
              Current Signal
            </div>
            <div className="mt-4">
              {loading || !metrics ? (
                <div className="skeleton h-10 w-44 rounded-full bg-[rgba(255,255,255,0.1)]" />
              ) : (
                <PatternBadge pattern={metrics.pattern_hint} />
              )}
            </div>

            <div className="mt-6 space-y-3">
              {(metrics?.anomalies || []).slice(0, 2).map((item) => (
                <div
                  key={item.title}
                  className="rounded-[20px] bg-[rgba(255,255,255,0.04)] px-4 py-3"
                >
                  <div className="text-sm font-medium text-[var(--text-primary)]">
                    {item.title}
                  </div>
                  <div className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <ExportActions
                targetRef={exportRef}
                fileName={`${selectedDeveloper?.developer_name || "developer"}-${selectedMonth || "snapshot"}`}
                summaryText={summaryText}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {(loading || shellLoading) && metricCards.length === 0
          ? Array.from({ length: 5 }).map((_, index) => (
              <MetricCard
                key={index}
                label="Loading"
                value="--"
                unit=""
                definition="Loading metric definition"
                loading
              />
            ))
          : metricCards.map((card) => <MetricCard key={card.label} {...card} />)}
      </section>

      {error === "Not found" ? (
        <div className="panel-surface flex min-h-[240px] items-center justify-center rounded-[28px] px-6 text-center text-[var(--text-secondary)]">
          No data for this period
        </div>
      ) : null}

      {metrics && error !== "Not found" ? (
        <>
          <div className="grid gap-6 xl:grid-cols-2">
            <AnomalyPanel items={metrics.anomalies} />
            <BenchmarkPanel items={metrics.benchmarks} />
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <InsightPanel items={metrics.interpretation} />
            <NextSteps steps={metrics.nextSteps} />
          </div>

          <MetricTrendChart data={metrics.trendData} />

          <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <TimelineStrip items={metrics.activityTimeline} />
            <NotesPanel
              storageKey={`developer-${selectedDeveloperId}-${selectedMonth}`}
              title="Notes & Follow-Ups"
              subtitle="Capture contextual manager notes or follow-up actions tied to this developer and month."
              placeholder="Add a follow-up action, coaching point, or observation for this developer..."
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
