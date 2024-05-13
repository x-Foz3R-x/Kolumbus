import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button, Icons } from "~/components/ui";

export default function PageLink(props: {
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
        variant="unset"
        size="unset"
        className={cn(props.disabled && "cursor-default")}
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
            className="relative flex size-11 items-center justify-center fill-gray-400 duration-250 ease-kolumb-flow hover:fill-gray-700"
          >
            {props.development && <span className="absolute -left-0.5 -top-0.5 text-xs">🏗️</span>}
            <Icon className="size-5 scale-100" />
          </Link>
        </div>
      </Button>
    </div>
  );
}
