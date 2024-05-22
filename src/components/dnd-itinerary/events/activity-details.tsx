import { memo, useEffect, useMemo, useRef, useState } from "react";
import type { ActivityEvent } from "~/lib/validations/event";
import { EASING } from "~/lib/motion";
import { Floating } from "~/components/ui/floating";
import { ActivityDetailsContent } from "./activity-details-content";

// * test/proposal - render activity as the trigger in triggerProps instead of a span

// activity details height: borderHeight + imageHeight + NameHeight + controlsHeight -> 8 + 164 + 44 + 48 = 264
const DETAILS_INIT_HEIGHT = 264;
const DETAILS_SECTION_INIT_HEIGHT = 246;

type ActivityDetailsProps = {
  event: ActivityEvent;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: (event: ActivityEvent) => void;
  onDelete: () => void;
};
export const ActivityDetails = memo(function ActivityDetailsWrapper({
  event,
  isOpen,
  setIsOpen,
  onClose: handleClose,
  onDelete: handleDelete,
}: ActivityDetailsProps) {
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [detailsHeight, setDetailsHeight] = useState(DETAILS_SECTION_INIT_HEIGHT);

  // Resize observer to update the height of the details section
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries[0]) return;
      setDetailsHeight((entries[0].target as HTMLElement).offsetHeight);
    });

    if (isOpen && detailsRef.current) {
      resizeObserver.observe(detailsRef.current);
    } else if (isOpen) {
      const observer = new MutationObserver((_, observer) => {
        observer.disconnect();
        if (detailsRef.current) resizeObserver.observe(detailsRef.current);
      });
      observer.observe(document.body, { childList: true });
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [detailsRef, isOpen]);

  const animation = useMemo(
    () => ({
      initial: {
        width: "160px",
        height: "112px",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0 0px 0px rgba(0,0,0,0)",
      },
      animate: {
        width: "320px",
        height: `${detailsHeight + DETAILS_INIT_HEIGHT}px`,
        borderWidth: "4px",
        borderRadius: "16px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0 16px 16px rgba(0,0,0,0.03)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
      exit: {
        width: "160px",
        height: "112px",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0 0px 0px rgba(0,0,0,0)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
    }),
    [detailsHeight],
  );

  return (
    <Floating
      isOpen={isOpen}
      onOpenChange={() => {
        setIsOpen(false);
        handleClose(event);
      }}
      placement="top-start"
      offset={({ rects }) => ({
        mainAxis: -rects.reference.height - (rects.floating.height - rects.reference.height),
      })}
      shift={false}
      flip={false}
      size={false}
      customAnimation={animation}
      trapFocus
      initialFocus={-1}
      zIndex={30}
      className="mb-5 mr-5 h-28 w-40 overflow-hidden rounded-lg border-2 border-white bg-white text-sm"
      triggerProps={{
        asChild: true,
        children: (
          <span
            tabIndex={-1}
            className="pointer-events-none invisible absolute -inset-0.5 select-none opacity-0"
          />
        ),
      }}
    >
      <ActivityDetailsContent
        event={event}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDelete={handleDelete}
        detailsRef={detailsRef}
        detailsHeight={detailsHeight}
      />
    </Floating>
  );
});
