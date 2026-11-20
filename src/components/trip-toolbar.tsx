import { cn } from "~/lib/utils";

export default function TripToolbar({
  navigation,
  actions,
  className,
}: {
  navigation: React.ReactNode;
  actions: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "flex h-14 items-center justify-between gap-3 border-b bg-white/80 px-[1.375rem] backdrop-blur-lg backdrop-saturate-[180%]",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">{navigation}</div>
      <div className="flex shrink-0 items-center justify-end gap-2">{actions}</div>
    </header>
  );
}
