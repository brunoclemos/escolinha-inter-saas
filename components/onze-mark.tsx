import { cn } from "@/lib/utils";

export function OnzeMark({
  className,
  size = "md",
  showWordmark = true,
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}) {
  const sizes = {
    sm: { box: "h-7 w-7 text-[13px]", text: "text-sm" },
    md: { box: "h-9 w-9 text-base", text: "text-lg" },
    lg: { box: "h-12 w-12 text-xl", text: "text-2xl" },
  } as const;
  const s = sizes[size];

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-md bg-brand font-bold text-brand-fg shadow-sm",
          s.box
        )}
        aria-hidden
      >
        11
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            s.text
          )}
        >
          Onze
        </span>
      )}
    </div>
  );
}
