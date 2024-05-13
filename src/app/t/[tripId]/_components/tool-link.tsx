import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button, Icons } from "~/components/ui";

export default function ToolLink(props: {
  active: boolean;
  tripId: string;
  title: string;
  slug: string;
  icon: keyof typeof Icons;
  development: boolean;
  disabled: boolean;
}) {
  const url = `/t/${props.tripId}/${props.slug}`;
  const Icon = Icons[props.icon];

  return (
    <div id={props.icon}>
      <Button
        variant="appear"
        size="unset"
        className={cn(
          "rounded-md border-[0.5px] bg-gray-50 outline outline-2 outline-transparent duration-400 hover:border-gray-300 hover:outline-gray-100",
          props.active &&
            "border-kolumblue-200 bg-kolumblue-50 hover:border-kolumblue-300 hover:outline-kolumblue-100",
          props.disabled && "cursor-default hover:border-gray-200 hover:outline-transparent",
        )}
        tooltip={{
          placement: "right",
          offset: { mainAxis: 14 },
          rootSelector: `#${props.icon}`,
          className: "whitespace-nowrap font-belanosima text-base px-3 py-1.5 rounded-lg",
          children: props.title,
        }}
      >
        <div className={cn(props.disabled && "pointer-events-none opacity-50")}>
          <Link
            href={url}
            className={cn(
              "relative flex size-[3.75rem] items-center justify-center fill-gray-400 duration-250 ease-kolumb-flow hover:fill-gray-700",
              props.active && "fill-kolumblue-500 hover:fill-kolumblue-500",
            )}
          >
            {props.development && <span className="absolute left-0.5 top-1 text-xs">🏗️</span>}
            <Icon className="size-7 scale-100" />
          </Link>
        </div>
      </Button>
    </div>
  );
}
