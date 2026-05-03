import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { formatMonth } from "../lib/formatters";

export default function MonthToggle({
  months,
  selectedMonth,
  onSelectMonth,
  disabled = false
}) {
  return (
    <Tabs
      value={selectedMonth}
      onValueChange={(value) => {
        if (!disabled) {
          onSelectMonth(value);
        }
      }}
      className={cn(disabled && "pointer-events-none opacity-60")}
    >
      <ScrollArea className="w-full whitespace-nowrap">
        <TabsList className="min-w-max">
          {months.map((month) => (
            <TabsTrigger key={month} value={month}>
              {formatMonth(month)}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Tabs>
  );
}
