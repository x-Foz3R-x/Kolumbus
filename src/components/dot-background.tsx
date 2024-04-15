import { cn } from "@/lib/utils";

type DotBackgroundProps = {
  children: React.ReactNode;
  className?: { background?: string; mask?: string };
};
export default function DotBackground({ className, children }: DotBackgroundProps) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center", className?.background)}>
      <span
        role="presentation"
        className={cn(
          "pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
          className?.mask,
        )}
      />
      {children}
    </div>
  );
}
