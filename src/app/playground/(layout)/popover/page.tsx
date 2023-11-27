"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import { TRANSITION } from "@/lib/framer-motion";

import { Popover, Offset, Flip, Arrow, Position, Motion, usePopover, Prevent } from "@/components/ui/popover";
import { Placement } from "@/components/ui/popover/types";
import { BasicInput } from "@/components/ui/input";
import Icon from "@/components/icons";
import Button from "@/components/ui/button";

export default function PopoverTests() {
  const [optionsTriggerRef, optionsPopoverRef, areOptionsOpen, setOptionsOpen, optionsInputType, setOptionsInputType] = usePopover();
  const [triggerRef, popoverRef, isOpen, setOpen, inputType, setInputType] = usePopover();

  const [placement, setPlacement] = useState("top" as Placement);
  const [padding, setPadding] = useState(100);
  const [offset, setOffset] = useState(5);
  const [arrowSize, setArrowSize] = useState(12);

  const arrowStyles = { arrow: "bg-gray-800 rounded-[3px]", backdrop: "shadow-borderXL rounded-[3px]" };

  const handleClose = useCallback(() => {
    setOpen(false), [setOpen];
    triggerRef.current?.focus({ preventScroll: true });
  }, [triggerRef, setOpen]);

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
    <div className="h-screen w-screen bg-red-100">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center text-lg font-bold text-gray-800">
        Popover
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl bg-green-100 shadow-borderXL" />
      <span className="pointer-events-none absolute left-52 top-14 select-none p-3 text-red-600">margin</span>
      <span className="pointer-events-none absolute left-52 top-36 select-none p-3 text-green-600">padding</span>

      <div
        style={{ insetInline: 200 + padding, top: 150 + padding, bottom: 50 + padding }}
        className="absolute overflow-hidden rounded-lg border-2 border-gray-200 bg-white"
      >
        <span className="rounded-br-lg bg-gray-200 p-1 pr-1.5">Boundary</span>
      </div>
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="h-3 w-3 cursor-default rounded-full bg-red-450" />
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="h-3 w-3 rounded-full bg-green-600" />
        </div>

        <button
          ref={optionsTriggerRef}
          aria-haspopup="menu"
          {...(areOptionsOpen && { "aria-expanded": true })}
          onClick={(e) => {
            setOptionsOpen(!areOptionsOpen);
            setOptionsInputType(e.detail === 0 ? "keyboard" : "mouse");
          }}
          className="flex items-center gap-1.5"
        >
          <h2 className="font-medium text-gray-800">Container</h2>
          <Icon.chevron className={`h-[5px] duration-300 ease-kolumb-flow ${areOptionsOpen && "rotate-180"}`} />
        </button>
        <Popover
          popoverRef={optionsPopoverRef}
          triggerRef={optionsTriggerRef}
          isOpen={areOptionsOpen}
          setOpen={setOptionsOpen}
          placement="bottom"
          extensions={[
            Position("calc(50% - 88px)", 149, "top"),
            Motion(TRANSITION.fadeInScaleY),
            Prevent({ autofocus: optionsInputType !== "keyboard" }),
          ]}
          className="z-50 flex w-44 flex-col gap-3 rounded-b-xl bg-gray-50 px-4 py-2 text-xs"
        >
          <div className="flex flex-col items-center gap-1 text-sm">
            Placement
            <select
              value={placement}
              onChange={(e) => setPlacement(e.target.value as Placement)}
              className="appearance-none rounded-md border px-2 text-center"
            >
              <option value="top">top</option>
              <option value="top-start">top-start</option>
              <option value="top-end">top-end</option>

              <option value="bottom">bottom</option>
              <option value="bottom-start">bottom-start</option>
              <option value="bottom-end">bottom-end</option>

              <option value="right">right</option>
              <option value="right-start">right-start</option>
              <option value="right-end">right-end</option>

              <option value="left">left</option>
              <option value="left-start">left-start</option>
              <option value="left-end">left-end</option>
            </select>
          </div>

          {/* Sliders */}
          <div className="relative flex flex-col items-center justify-center">
            <span className="pb-1">Padding</span>
            <div className="absolute left-0 right-0 top-0 flex justify-between">
              <span>0</span>
              <span>500</span>
            </div>
            <BasicInput
              type="range"
              step={25}
              min={0}
              max={500}
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full rounded p-0.5"
            />
          </div>
          <div className="relative flex flex-col items-center justify-center text-xs">
            <span className="pb-1">Offset</span>
            <div className="absolute left-0 right-0 top-0 flex justify-between">
              <span>0</span>
              <span>30</span>
            </div>
            <BasicInput
              type="range"
              step={3}
              min={0}
              max={30}
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full rounded p-0.5"
            />
          </div>
          <div className="relative flex flex-col items-center justify-center">
            <span className="pb-1">Arrow</span>
            <div className="absolute left-0 right-0 top-0 flex justify-between">
              <span>0</span>
              <span>10</span>
            </div>
            <BasicInput
              type="range"
              step={3}
              min={0}
              max={30}
              value={arrowSize}
              onChange={(e) => setArrowSize(Number(e.target.value))}
              className="w-full rounded p-0.5"
            />
          </div>
        </Popover>

        <p className="absolute right-4 flex gap-2 text-sm font-medium text-gray-800">Tip: use scroll</p>
      </div>

      <div
        id="center"
        ref={centerRef}
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 overflow-auto rounded-b-xl"
      >
        <main style={{ width: "calc(200% - 59px)", height: "calc(200% - 34px)" }} className="relative flex items-center justify-center">
          <Button
            ref={triggerRef}
            aria-haspopup="dialog"
            {...(isOpen && { "aria-expanded": true })}
            onClick={(e) => {
              setOpen(!isOpen);
              setInputType(e.detail === 0 ? "keyboard" : "mouse");
            }}
            className="border border-gray-600 bg-gray-700 font-medium text-gray-100"
          >
            open
          </Button>

          <Popover
            popoverRef={popoverRef}
            triggerRef={triggerRef}
            isOpen={isOpen}
            setOpen={setOpen}
            placement={placement}
            container={{ selector: "main", margin: [150, 200, 50, 200], padding }}
            extensions={[Offset(offset), Flip(), Arrow(arrowSize, arrowStyles), Prevent({ autofocus: inputType !== "keyboard" })]}
            className="rounded-md text-gray-100 shadow-borderXL"
          >
            <div className="relative z-10 flex items-center justify-center gap-3 rounded-md bg-gray-800 px-4 py-3">
              <Button
                onClick={handleClose}
                variant="button"
                size="icon"
                className="border border-gray-600 bg-gray-700 fill-gray-300 p-2 focus:fill-gray-100"
              >
                <Icon.x className="h-3.5 w-3.5" />
              </Button>
              popover
            </div>
          </Popover>

          {/* Rulers */}
          <div style={{ paddingBlock: "15px" }} className="absolute -z-10 w-full border-y-4 border-double border-black/10" />
          <div style={{ paddingInline: "29px" }} className="absolute -z-10 h-full border-x-4 border-double border-black/10" />
        </main>
      </div>
    </div>
  );
}
