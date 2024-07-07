import { cn } from "~/lib/utils";

type Props = {
  className?: { background?: string; mask?: string };
  children: React.ReactNode;
};
export default function MaskBackground({ className, children }: Props) {
  return (
    <div className={className?.background}>
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
