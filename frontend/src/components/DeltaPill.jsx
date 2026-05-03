import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const toneClasses = {
  positive: {
    variant: "success",
    Icon: TrendingUp
  },
  negative: {
    variant: "destructive",
    Icon: TrendingDown
  },
  neutral: {
    variant: "neutral",
    Icon: Minus
  }
};

export default function DeltaPill({ comparison, compact = false }) {
  if (!comparison) {
    return null;
  }

  const tone = toneClasses[comparison.sentiment] || toneClasses.neutral;
  const Icon = tone.Icon;

  if (compact) {
    return (
      <Badge
        variant={tone.variant}
        className="gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      >
        <Icon className="h-3 w-3" />
        {comparison.shortLabel}
      </Badge>
    );
  }

  return (
    <div className="space-y-2">
      <Badge
        variant={tone.variant}
        className="gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium"
      >
        <Icon className="h-3 w-3" />
        {comparison.shortLabel}
      </Badge>
      <p className="text-xs leading-5 text-muted-foreground">
        {comparison.label}
      </p>
    </div>
  );
}
