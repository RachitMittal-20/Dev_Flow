import { useEffect, useState } from "react";
import { getManagerMetrics } from "../api";
import ManagerTable from "../components/ManagerTable";
import MonthToggle from "../components/MonthToggle";
import PatternBadge from "../components/PatternBadge";
import { formatMonth } from "../lib/formatters";

const chipClass =
  "rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1.5 text-sm text-[rgba(232,234,240,0.82)]";

export default function ManagerView({
  selectedMonth,
  onSelectMonth,
  months,
  shellLoading,
  shellError
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedMonth) {
      return;
    }

    let isActive = true;

    async function loadManagerMetrics() {
      setLoading(true);

      try {
        const payload = await getManagerMetrics(selectedMonth);

        if (isActive) {
          setRows(payload);
          setError("");
        }
      } catch (loadError) {
        if (isActive) {
          setRows([]);
          setError(loadError.message || "Unable to load manager summary.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadManagerMetrics();

    return () => {
      isActive = false;
    };
  }, [selectedMonth]);

  const bannerError = shellError || error;
  const healthyCount = rows.filter((row) => row.signal === "Healthy flow").length;
  const watchCount = rows.length - healthyCount;
  const strongestSignal = rows.find((row) => row.signal === "Healthy flow") || rows[0];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {bannerError ? (
        <div className="rounded-2xl border border-[rgba(245,101,101,0.28)] bg-[rgba(245,101,101,0.12)] px-4 py-3 text-sm text-[rgba(255,212,212,0.94)]">
          {bannerError}
        </div>
      ) : null}

      <section className="panel-surface rounded-[32px] p-6 lg:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--text-secondary)]">
                Manager Summary
              </div>
              <h1 className="text-4xl font-semibold tracking-[-0.05em] lg:text-6xl">
                Team signals for {selectedMonth ? formatMonth(selectedMonth) : "the active month"}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[rgba(232,234,240,0.86)]">
                Compare managers side by side to see where delivery is flowing
                cleanly, where quality needs watching, and which teams deserve a
                closer drilldown.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={chipClass}>{rows.length} managers in view</span>
              <span className={chipClass}>{healthyCount} healthy-flow teams</span>
              <span className={chipClass}>{watchCount} teams needing attention</span>
            </div>
          </div>

          <div className="space-y-5 rounded-[28px] bg-[rgba(255,255,255,0.03)] p-5">
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

            {strongestSignal ? (
              <div className="rounded-[22px] bg-[rgba(255,255,255,0.04)] p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                  Read This First
                </div>
                <div className="mt-3">
                  <PatternBadge pattern={strongestSignal.signal} />
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                  {strongestSignal.summaryNarrative}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {loading ? (
        <section className="panel-surface rounded-[28px] p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="skeleton h-16 rounded-2xl bg-[rgba(255,255,255,0.06)]"
              />
            ))}
          </div>
        </section>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="panel-surface flex min-h-[240px] items-center justify-center rounded-[28px] px-6 text-center text-[var(--text-secondary)]">
          No data for this period
        </div>
      ) : null}

      {!loading && rows.length > 0 ? <ManagerTable data={rows} /> : null}
    </div>
  );
}
