import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-[0.01em] transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-primary/25 bg-primary/12 text-primary",
        secondary: "border-white/8 bg-white/5 text-foreground/80",
        outline: "border-white/10 bg-transparent text-muted-foreground",
        success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
        warning: "border-amber-300/20 bg-amber-300/10 text-amber-200",
        destructive: "border-rose-400/20 bg-rose-400/10 text-rose-300",
        neutral: "border-white/8 bg-white/[0.04] text-muted-foreground"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
