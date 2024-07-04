import { cn } from "~/lib/utils";
import { Button } from "../ui";
import { useEffect, useRef, useState } from "react";

export default function PortalWindow(props: {
  id?: string;
  title: string;
  state: { isOpen: boolean; isMinimized: boolean };
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  className?: string;
}) {
  const [hasContent, setHasContent] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          if (!!bodyRef.current && bodyRef.current.hasChildNodes()) {
            setHasContent(true);
          } else {
            setHasContent(false);
          }
        }
      }
    });

    if (bodyRef.current) {
      observer.observe(bodyRef.current, { childList: true });
    }

    return () => observer.disconnect();
  }, []);

  if (!props.state.isOpen) return null;

  return (
    <div
      className={cn(
        "z-10 h-fit w-fit overflow-hidden rounded-[10px] shadow-borderSplashXl duration-500 ease-kolumb-flow",
        props.state.isMinimized && "scale-0",
        !hasContent && "hidden",
        props.className,
      )}
    >
      {/* Frame */}
      <div className="relative flex h-10 rounded-t-[10px] bg-stone-200/90 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
        {/* Controls */}
        <div className="flex h-full items-center gap-2 px-5">
          <Button
            onClick={props.onClose}
            variant="unset"
            size="unset"
            className="h-3 w-3 rounded-full border-[0.5px] border-red-600 bg-red-500"
          />
        </div>

        {/* Title */}
        <div className="flex h-full w-full items-center justify-center px-5 text-[15px] font-semibold mix-blend-color-burn">
          {props.title}
        </div>

        <span className="w-[52px] flex-shrink-0" />
      </div>

      {/* Body */}
      <div ref={bodyRef} id={props.id} className="w-fit min-w-full bg-white"></div>
    </div>
  );
}
