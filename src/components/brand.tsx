import { Icons } from "~/components/ui";
import { cn } from "~/lib/utils";

export default function Brand({
  compact = false,
  inverse = false,
  className,
}: {
  compact?: boolean;
  inverse?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2.5 font-belanosima text-2xl font-semibold leading-none",
        inverse ? "text-white" : "text-kolumblue-500",
        className,
      )}
      aria-label="Kolumbus"
    >
      <Icons.logo
        aria-hidden="true"
        className={cn("size-9 shrink-0", inverse ? "fill-white" : "fill-kolumblue-500")}
      />
      {!compact && <span>Kolumbus</span>}
    </span>
  );
}
