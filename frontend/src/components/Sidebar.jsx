import { NavLink } from "react-router-dom";
import MonthToggle from "./MonthToggle";

function NavigationLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
          isActive
            ? "border-[rgba(79,142,247,0.18)] bg-[rgba(79,142,247,0.14)] text-white shadow-[0_16px_30px_rgba(79,142,247,0.16)]"
            : "border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)]"
        ].join(" ")
      }
    >
      {children}
    </NavLink>
  );
}

export default function Sidebar({
  developers,
  months,
  selectedDeveloperId,
  onSelectDeveloper,
  selectedMonth,
  onSelectMonth,
  loading,
  showDeveloperControls
}) {
  return (
    <aside className="no-print relative z-20 w-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-[236px]">
      <div className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(9,13,24,0.82)] backdrop-blur-2xl lg:h-full lg:border-b-0 lg:border-r lg:border-[rgba(255,255,255,0.06)]">
        <div className="flex h-full flex-col gap-6 p-4 lg:p-5">
          <div className="panel-surface rounded-[26px] p-4">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,rgba(79,142,247,0.6),rgba(167,139,250,0.65))] text-lg font-semibold text-white shadow-[0_12px_24px_rgba(79,142,247,0.2)]">
              D
            </div>
            <div>
              <div className="text-lg font-semibold">DevFlow</div>
              <p className="mt-1 text-sm leading-5 text-[rgba(232,234,240,0.72)]">
                From raw delivery metrics to a clear team story.
              </p>
            </div>
          </div>

          <nav className="grid gap-2">
            <NavigationLink to="/">IC View</NavigationLink>
            <NavigationLink to="/manager">Manager View</NavigationLink>
          </nav>

          {showDeveloperControls ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="developer-select"
                  className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]"
                >
                  Developer
                </label>
                <select
                  id="developer-select"
                  value={selectedDeveloperId}
                  onChange={(event) => onSelectDeveloper(event.target.value)}
                  disabled={loading || developers.length === 0}
                  className="w-full rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition-colors duration-200 hover:border-[rgba(79,142,247,0.25)] focus:border-[rgba(79,142,247,0.5)]"
                >
                  {developers.map((developer) => (
                    <option
                      key={developer.developer_id}
                      value={developer.developer_id}
                    >
                      {`${developer.developer_name} — ${developer.team_name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                  Month
                </div>
                <MonthToggle
                  months={months}
                  selectedMonth={selectedMonth}
                  onSelectMonth={onSelectMonth}
                  disabled={loading || months.length === 0}
                />
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] bg-[rgba(255,255,255,0.03)] p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-secondary)]">
                Team Summary
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
                Compare manager-level signals across the active month to spot
                shared bottlenecks and healthier release patterns.
              </p>
            </div>
          )}

          <div className="rounded-[24px] bg-[rgba(255,255,255,0.02)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
            Use the IC view to understand one developer in context, then flip to
            the manager summary to compare how those patterns stack up across
            teams.
          </div>
        </div>
      </div>
    </aside>
  );
}
