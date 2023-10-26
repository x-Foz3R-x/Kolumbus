"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { Popover, Offset, Flip, Arrow } from "@/components/ui/popover";
import { Placement } from "@/components/ui/popover/types";

export default function PopoverTests() {
  const [isOpen, setIsOpen] = useState(false);
  const targetRef = useRef(null);
  const popoverRef = useRef(null);

  const placement: Placement = "top";
  const containerSelector = "main";
  const padding = 250;
  const offset = 5;
  const arrowSize = 12;
  const arrowStyles = {
    arrow: "bg-gray-800 rounded-[3px]",
    backdrop: "shadow-borderXL rounded-[3px]",
  };

  //#region centering logic
  window.addEventListener("load", () => {
    const center = document.getElementById("center");
    if (!center) return;
    center.scrollTo({ top: center.scrollHeight / 2 - center.offsetHeight / 2, left: center.scrollWidth / 2 - center.offsetWidth / 2 });
  });
  const centerRef = useRef<HTMLDivElement | null>(null);
  useLayoutEffect(() => {
    if (!centerRef.current) return;
    centerRef.current.scrollTo({
      top: centerRef.current.scrollHeight / 2 - centerRef.current.offsetHeight / 2,
      left: centerRef.current.scrollWidth / 2 - centerRef.current.offsetWidth / 2,
    });
  }, []);
  //#endregion

  return (
    <>
      <div id="center" ref={centerRef} style={{ inset: 200, top: 150, bottom: 50 }} className="absolute z-20 overflow-auto rounded-b-xl">
        <main style={{ width: "calc(200% - 59px)", height: "calc(200% - 34px)" }} className="relative flex items-center justify-center">
          <button
            ref={targetRef}
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-gray-100 focus:bg-kolumblue-600"
          >
            open
          </button>

          <Popover
            popoverRef={popoverRef}
            targetRef={targetRef}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            placement={placement}
            container={{ selector: containerSelector, margin: [150, 200, 50, 200], padding }}
            extensions={[Offset(offset), Flip(), Arrow(arrowSize, arrowStyles)]}
          >
            <div className="flex items-center justify-center gap-3 rounded-md bg-gray-800 px-4 py-3 text-gray-100 shadow-borderXL">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-8 w-8 rounded border border-gray-600 bg-gray-700 focus:bg-kolumblue-600"
              >
                X
              </button>
              popover
            </div>
          </Popover>

          {/* Rulers */}
          <div style={{ paddingBlock: "15px" }} className="absolute -z-10 w-full border-y-4 border-double border-black/10" />
          <div style={{ paddingInline: "27px" }} className="absolute -z-10 h-full border-x-4 border-double border-black/10" />
        </main>
      </div>

      {/* Boundary */}
      <div
        style={{ inset: 200 + padding, top: 150 + padding, bottom: 50 + padding }}
        className="absolute overflow-hidden rounded-lg border-2 border-gray-200 bg-white"
      >
        <span className="rounded-br-lg bg-gray-200 p-1 pr-1.5">Boundary</span>
      </div>
    </>
  );
}
