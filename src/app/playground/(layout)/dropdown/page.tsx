"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import { Popover, position, Motion, usePopover } from "@/components/ui/popover";
import { Placement } from "@/components/ui/popover/types";
import { BasicInput } from "@/components/ui/input";
import Icon from "@/components/icons";
import Dropdown, { DropdownGroup, DropdownList, DropdownOption } from "@/components/ui/dropdown";
import { TRANSITION } from "@/lib/framer-motion";

export default function DropdownTests() {
  const [optionsTargetRef, optionsPopoverRef, areOptionsOpen, setOptionsOpen] = usePopover();

  const [placement, setPlacement] = useState("right-start" as Placement);
  const [padding, setPadding] = useState(100);
  const [offset, setOffset] = useState(5);

  const dropdownList: DropdownList = [
    { onSelect: () => {}, index: 0 },
    { onSelect: () => {}, index: 1 },
    { onSelect: () => {}, index: 2 },
    { onSelect: () => {}, index: 3 },
    { onSelect: () => {}, index: 4 },
    { onSelect: () => {}, index: 5 },
  ];

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
    <div className="h-screen w-screen bg-gray-50">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center text-lg font-medium text-gray-800">
        Dropdown
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl border-gray-50 bg-green-100 shadow-borderXL" />
      <span className="pointer-events-none absolute left-52 top-36 select-none p-3 text-green-600">padding</span>

      <div
        style={{ insetInline: 200 + padding, top: 150 + padding, bottom: 50 + padding }}
        className="absolute overflow-hidden rounded-lg border-2 border-gray-200 bg-white"
      >
        <span className="rounded-br-lg bg-gray-200 p-1 pr-1.5">Boundary</span>
      </div>
      <div style={{ insetInline: 200, top: 106 }} className="absolute z-[110] flex h-11 items-center justify-center rounded-t-xl bg-white">
        <div className="absolute left-4 flex gap-2">
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="h-3 w-3 cursor-default rounded-full bg-red-500"></Link>
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="h-3 w-3 rounded-full bg-green-500" />
        </div>

        <button
          ref={optionsTargetRef}
          aria-haspopup="menu"
          {...(areOptionsOpen && { "aria-expanded": true })}
          onClick={() => setOptionsOpen(!areOptionsOpen)}
          className="flex items-center gap-1.5"
        >
          <h2 className="font-medium text-gray-800">Container</h2>
          <Icon.chevron className={`h-[5px] duration-300 ease-kolumb-flow ${areOptionsOpen && "rotate-180"}`} />
        </button>
        <Popover
          popoverRef={optionsPopoverRef}
          targetRef={optionsTargetRef}
          isOpen={areOptionsOpen}
          setOpen={setOptionsOpen}
          placement="bottom"
          extensions={[position("calc(50% - 88px)", 150, "top"), Motion(TRANSITION.fadeInScale)]}
          className="flex w-44 flex-col gap-3 rounded-b-xl bg-white px-4 py-2 text-xs shadow-md"
        >
          {/* Placement */}
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
          <Dropdown
            list={dropdownList}
            placement={placement}
            margin={[150, 200, 50, 200]}
            padding={padding}
            offset={offset}
            buttonChildren={<span>open</span>}
            preventScroll
          >
            <p className="rounded-lg bg-yellow-500/20 text-center text-xs leading-relaxed text-gray-300 shadow-soft">Tip: use arrow keys</p>
            <DropdownOption index={0} optionVariant={"blue"}>
              Option 1
            </DropdownOption>
            <DropdownOption index={1} optionVariant={"blue"}>
              Option 2
            </DropdownOption>

            <DropdownGroup title="Actions">
              <DropdownOption index={2}>New file</DropdownOption>
              <DropdownOption index={3}>Edit file</DropdownOption>
              <DropdownOption index={4}>Replace file</DropdownOption>
            </DropdownGroup>

            <DropdownGroup title="Danger">
              <DropdownOption index={5} optionVariant="danger">
                Delete file
              </DropdownOption>
            </DropdownGroup>
          </Dropdown>

          {/* Rulers */}
          <div style={{ paddingBlock: "15px" }} className="absolute -z-10 w-full border-y-4 border-double border-black/10" />
          <div style={{ paddingInline: "27px" }} className="absolute -z-10 h-full border-x-4 border-double border-black/10" />
        </main>
      </div>
    </div>
  );
}
