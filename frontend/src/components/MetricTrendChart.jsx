import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { formatMonth } from "../lib/formatters";

function TrendTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(10,14,26,0.95)] p-4 shadow-[0_18px_32px_rgba(0,0,0,0.32)]">
      <div className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
        {formatMonth(label)}
      </div>
      <div className="space-y-2 text-sm text-[var(--text-secondary)]">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}
            </span>
            <span className="metric-value text-[var(--text-primary)]">
              {entry.value.toFixed(2)}d
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MetricTrendChart({
  data,
  title = "Trend over time",
  description = "Lead time and cycle time are charted together so you can quickly see whether delivery is improving before merge, after merge, or across the whole workflow."
}) {
  return (
    <section className="panel-surface rounded-[28px] p-6">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--text-secondary)]">
            {title}
          </div>
          <h2 className="mt-2 text-2xl font-semibold">
            Delivery speed across the available months
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-6 text-[var(--text-secondary)]">
          {description}
        </p>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.08)"
              vertical={false}
              strokeDasharray="4 8"
            />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fill: "#8b91a8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${value}d`}
              tick={{ fill: "#8b91a8", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <Tooltip content={<TrendTooltip />} />
            <Line
              type="monotone"
              dataKey="lead_time"
              name="Lead Time"
              stroke="#4f8ef7"
              strokeWidth={3}
              dot={{ r: 4, fill: "#4f8ef7", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#4f8ef7", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="cycle_time"
              name="Cycle Time"
              stroke="#3ecf8e"
              strokeWidth={3}
              dot={{ r: 4, fill: "#3ecf8e", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#3ecf8e", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
