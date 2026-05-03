import { AlertTriangle, CheckCircle2, Clock3, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const badgeMap = {
  "Healthy flow": {
    Icon: CheckCircle2,
    variant: "success"
  },
  "Quality watch": {
    Icon: AlertTriangle,
    variant: "warning"
  },
  "Needs review": {
    Icon: RotateCcw,
    variant: "destructive"
  },
  "Watch bottlenecks": {
    Icon: Clock3,
    variant: "secondary"
  }
};

export default function PatternBadge({ pattern }) {
  const badge = badgeMap[pattern] || badgeMap["Watch bottlenecks"];
  const Icon = badge.Icon;

  return (
    <Badge
      variant={badge.variant}
      className="gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium"
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{pattern}</span>
    </Badge>
  );
}
