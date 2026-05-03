import { Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import DeltaPill from "./DeltaPill";
import StatusPill from "./StatusPill";

const thresholdMap = {
  green: {
    dot: "bg-emerald-300",
    glow: "shadow-[0_0_0_8px_rgba(52,211,153,0.12)]",
    label: "Healthy pace"
  },
  amber: {
    dot: "bg-amber-200",
    glow: "shadow-[0_0_0_8px_rgba(251,191,36,0.12)]",
    label: "Watch closely"
  },
  red: {
    dot: "bg-rose-300",
    glow: "shadow-[0_0_0_8px_rgba(251,113,133,0.12)]",
    label: "Needs attention"
  }
};

export default function MetricCard({
  label,
  value,
  unit,
  threshold = "amber",
  definition,
  comparison,
  benchmark,
  loading = false
}) {
  const thresholdStyle = thresholdMap[threshold] || thresholdMap.amber;

  return (
    <Card className="card-hover rounded-[1.6rem]">
      <CardContent className="relative space-y-5 p-5">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-white/30 via-white/8 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full ${thresholdStyle.dot} ${thresholdStyle.glow}`}
            />
            <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {label}
            </span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition-colors duration-200 hover:border-white/16 hover:text-foreground"
                aria-label={`${label} definition`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>{definition}</TooltipContent>
          </Tooltip>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-28 rounded-2xl" />
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-10 w-full rounded-[1.2rem]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="metric-value text-3xl text-card-foreground lg:text-[2.2rem]">
                {value}
              </div>
              <div className="text-sm text-muted-foreground">{unit}</div>
              <div className="inline-flex rounded-full border border-white/8 bg-white/[0.035] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-faint">
                {thresholdStyle.label}
              </div>
            </div>

            {comparison ? <DeltaPill comparison={comparison} /> : null}

            {benchmark ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-white/[0.07] pt-4">
                <StatusPill status={benchmark.status} />
                <span className="text-[11px] text-muted-foreground">
                  {benchmark.targetLabel}
                </span>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
