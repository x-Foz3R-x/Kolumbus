import { useMemo } from "react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { Button, Icons } from "~/components/ui";

type Props = {
  title: string;
  slug: string;
  icon: keyof typeof Icons;
  development: boolean;
  disabled: boolean;
};
export default function PageLink({ title, slug, icon, development, disabled }: Props) {
  const url = useMemo(() => `/${slug}`, [slug]);
  const id = useMemo(() => title.toLowerCase().replace(/\s/g, "-"), [title]);
  const Icon = Icons[icon];

  return (
    <div id={id}>
      <Button
        variant="unset"
        size="unset"
        className={cn(disabled && "cursor-default")}
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
            href={url}
            className="relative flex size-11 items-center justify-center fill-gray-400 duration-250 ease-kolumb-flow hover:fill-gray-700"
          >
            {development && <span className="absolute -left-0.5 -top-0.5 text-xs">🏗️</span>}
            <Icon className="size-5 scale-100" />
          </Link>
        </div>
      </Button>
    </div>
  );
}
