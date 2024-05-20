import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button, Icons } from "~/components/ui";

type Props = {
  tripId: string;
  title: string;
  slug: string;
  icon: keyof typeof Icons;
  development: boolean;
  disabled: boolean;
};
export default function ToolLink({ tripId, title, slug, icon, development, disabled }: Props) {
  const location = usePathname();
  const path = useMemo(() => `/t/${tripId}${slug ? `/${slug}` : ""}`, [tripId, slug]);
  const isActive = useMemo(() => location === path, [location, path]);

  const id = useMemo(() => title.toLowerCase().replace(/\s/g, "-"), [title]);
  const Icon = Icons[icon];

  return (
    <div id={id}>
      <Button
        variant="appear"
        size="unset"
        className={cn(
          "rounded-md border-[0.5px] bg-gray-50 outline outline-2 outline-transparent duration-400 hover:border-gray-300 hover:outline-gray-100",
          isActive &&
            "border-kolumblue-200 bg-kolumblue-50 hover:border-kolumblue-300 hover:outline-kolumblue-100",
          disabled && "cursor-default hover:border-gray-200 hover:outline-transparent",
        )}
        tooltip={{
          placement: "right",
          offset: { mainAxis: 14 },
          rootSelector: `#${id}`,
          className: "whitespace-nowrap font-belanosima text-base px-3 py-1.5 rounded-lg",
          children: title,
        }}
      >
        <div className={cn(disabled && "pointer-events-none opacity-50")}>
          <Link
            href={path}
            className={cn(
              "relative flex size-[3.75rem] items-center justify-center fill-gray-400 duration-250 ease-kolumb-flow hover:fill-gray-700",
              isActive && "fill-kolumblue-500 hover:fill-kolumblue-500",
            )}
          >
            {development && <span className="absolute left-0.5 top-1 text-xs">🏗️</span>}
            <Icon className="size-7 scale-100" />
          </Link>
        </div>
      </Button>
    </div>
  );
}
