import { Icons } from "~/components/ui";
import { cn } from "~/lib/utils";

const tones = {
  dark: {
    background: "bg-gray-800",
    previous: "bg-white",
    fill: "fill-gray-800",
    text: "text-white",
  },
  blue: {
    background: "bg-kolumblue-500",
    previous: "bg-gray-800",
    fill: "fill-kolumblue-500",
    text: "text-white",
  },
  graphite: {
    background: "bg-stone-800",
    previous: "bg-kolumblue-500",
    fill: "fill-stone-800",
    text: "text-white",
  },
};

export default function ShowcaseSection({
  id,
  tone,
  side = "left",
  first = false,
  last = false,
  title,
  children,
}: {
  id: string;
  tone: keyof typeof tones;
  side?: "left" | "right";
  first?: boolean;
  last?: boolean;
  title: React.ReactNode;
  children: React.ReactNode;
}) {
  const colors = tones[tone];
  const pattern = tone === "graphite" ? "bg-dot-white/15" : "";

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("relative isolate scroll-mt-20 font-inter", colors.previous)}
    >
      <div
        className={cn(
          "relative flex w-[calc(100%-3rem)] items-end justify-center px-6 text-center sm:w-3/5 lg:px-10",
          first && "min-h-32 pt-24",
          side === "right" && "ml-auto",
        )}
      >
        <div
          aria-hidden="true"
          className={`${cn(
            "absolute inset-x-0 bottom-0 min-h-32 rounded-t-[3rem]",
            first ? "h-full" : "h-[calc(100%+6rem)]",
            colors.background,
          )} ${pattern}`}
        />
        <h2
          id={`${id}-heading`}
          className={cn(
            "relative z-10 text-balance font-belanosima text-3xl font-semibold leading-tight sm:text-4xl",
            colors.text,
          )}
        >
          {title}
        </h2>
        <Icons.insetRadius
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 size-6 sm:size-12",
            colors.fill,
            side === "right"
              ? "-left-6 rotate-180 sm:-left-12"
              : "-right-6 -rotate-90 sm:-right-12",
          )}
        />
      </div>
      <div className={colors.previous}>
        <div
          className={`${cn(
            "px-6 pt-24 sm:px-10 lg:px-14",
            last ? "pb-24" : "pb-40",
            colors.background,
            side === "right"
              ? "rounded-tl-3xl sm:rounded-tl-[3rem]"
              : "rounded-tr-3xl sm:rounded-tr-[3rem]",
          )} ${pattern}`}
        >
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </div>
      </div>
    </section>
  );
}
