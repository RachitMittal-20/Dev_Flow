import { Badge } from "@/components/ui/badge";

const statusMap = {
  "within target": "success",
  watch: "warning",
  "needs attention": "destructive"
};

export default function StatusPill({ status }) {
  return (
    <Badge
      variant={statusMap[status] || "warning"}
      className="rounded-full px-2.5 py-1 text-[11px] capitalize"
    >
      {status}
    </Badge>
  );
}
