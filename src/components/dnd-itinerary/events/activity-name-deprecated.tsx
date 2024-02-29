import { memo, useRef } from "react";

import { cn } from "@/lib/utils";

import Icon from "@/components/icons";
import { Button, Input, ScrollIndicator } from "@/components/ui";

type ActivityNameProps = {
  name: string;
  onChange: (name: string) => void;
  onInput: (name: string) => void;
  expanded: boolean;
  selected: boolean;
};
export const ActivityName = memo(function ActivityName({ name, onChange, onInput, expanded, selected }: ActivityNameProps) {
  const divScrollRef = useRef<HTMLDivElement | null>(null);
  const inputScrollRef = useRef<HTMLInputElement | null>(null);

  if (expanded) {
    return (
      <>
        <Input
          ref={inputScrollRef}
          name="activity name"
          placeholder="name"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          onInput={(e) => onInput(e.currentTarget.value)}
          variant="unset"
          size="unset"
          className="h-full"
          preventEmpty
          fullWidth
          fullHeight
        />
        <ScrollIndicator scrollRef={inputScrollRef} />
      </>
    );
  }

  return (
    <>
      <div ref={divScrollRef} className="w-full select-none">
        {name}
        <ScrollIndicator scrollRef={divScrollRef} className={cn(selected && "from-kolumblue-200")} />
      </div>

      <Button
        onClick={() => navigator.clipboard.writeText(name)}
        variant="unset"
        size="unset"
        className="absolute inset-y-0 right-0 z-10 fill-gray-500 px-2 opacity-0 duration-300 ease-kolumb-out hover:fill-gray-900 group-hover:opacity-100 group-hover:ease-kolumb-flow"
      >
        <Icon.copy className="pointer-events-none relative z-10 m-auto h-3" />

        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white via-white to-transparent",
            selected && "from-kolumblue-200 via-kolumblue-200",
          )}
        />
      </Button>
    </>
  );
});
