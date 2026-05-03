import { cn } from "@/lib/utils";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
  titleClassName
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="space-y-2.5">
        {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
        {title ? (
          <h2
            className={cn(
              "text-2xl font-semibold tracking-[-0.04em] text-card-foreground sm:text-[2rem]",
              titleClassName
            )}
          >
            {title}
          </h2>
        ) : null}
        {description ? (
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
