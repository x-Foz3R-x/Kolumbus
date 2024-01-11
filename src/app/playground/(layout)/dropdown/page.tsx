"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Placement } from "@/components/ui/popover/types";

import { Dropdown, DropdownGroupTitle, DropdownOption } from "@/components/ui/dropdown";
import { Button, Input } from "@/components/ui";
import Checkbox from "@/components/ui/checkbox/checkbox";

export default function DropdownTests() {
  const [isOpen, setOpen] = useState(false);
  const [placement, setPlacement] = useState("right-start" as Placement);
  const [offset, setOffset] = useState(5);
  const [preventScroll, setPreventScroll] = useState(true);

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
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-center text-lg font-medium">
        Dropdown
      </h1>

      {/* Dropdown demo */}
      <div className="relative flex h-[80vh] w-screen flex-col items-center justify-center">
        {/* Sliders */}
        <div className="flex items-end gap-5 py-5 text-xs">
          <div className="relative flex flex-col items-center justify-center">
            <span className="pb-1">Offset: {offset}px</span>
            <Input
              type="range"
              step={6}
              min={0}
              max={30}
              value={offset}
              onInput={(e) => setOffset(Number(e.currentTarget.value))}
              className="rounded p-0.5"
            />
          </div>

          <div className="relative flex flex-col items-center justify-center text-sm">
            <Checkbox isChecked={preventScroll} setIsChecked={setPreventScroll}>
              Prevent scroll
            </Checkbox>
          </div>
        </div>

        {/* Placement + Dropdown */}
        <div className="grid grid-cols-3 items-center justify-items-center gap-x-20 gap-y-10">
          <span />

          {/* top */}
          <div className="flex gap-5">
            <Button
              onClick={() => setPlacement("top-start")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top-start" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("top")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("top-end")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top-end" && "bg-gray-800")}
            />
          </div>
          <span />

          {/* left */}
          <div className="flex flex-col gap-5">
            <Button
              onClick={() => setPlacement("left-start")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left-start" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("left")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("left-end")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left-end" && "bg-gray-800")}
            />
          </div>
          <Dropdown
            isOpen={isOpen}
            setOpen={setOpen}
            listLength={6}
            skipIndexes={[1]}
            placement={placement}
            container={{ selector: "body", padding: 56 }}
            offset={offset}
            preventScroll={preventScroll}
            className="w-40"
            buttonProps={{
              className: "border border-gray-600 bg-gray-700 font-medium text-gray-100",
              children: isOpen ? "close" : "open",
            }}
          >
            <span className="absolute inset-x-2 -top-8 rounded-lg bg-orange-200 text-center text-xs leading-relaxed shadow-borderXL">
              Tip: use arrow keys
            </span>
            <DropdownOption index={0} variant="primary">
              Primary
            </DropdownOption>
            <DropdownOption index={1} variant="primary">
              Disabled
            </DropdownOption>

            <DropdownGroupTitle title="Actions" divider />
            <DropdownOption index={2}>Action 1</DropdownOption>
            <DropdownOption index={3}>Action 2</DropdownOption>

            <DropdownGroupTitle title="Danger" divider />
            <DropdownOption index={4} variant="danger" className="rounded-b-lg">
              Danger
            </DropdownOption>
          </Dropdown>

          {/* right */}
          <div className="flex flex-col gap-5">
            <Button
              onClick={() => setPlacement("right-start")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right-start" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("right")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("right-end")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right-end" && "bg-gray-800")}
            />
          </div>
          <span />

          {/* bottom */}
          <div className="flex gap-5">
            <Button
              onClick={() => setPlacement("bottom-start")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom-start" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("bottom")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom" && "bg-gray-800")}
            />
            <Button
              onClick={() => setPlacement("bottom-end")}
              variant="appear"
              size="icon"
              className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom-end" && "bg-gray-800")}
            />
          </div>
          <span />
        </div>
      </div>

      {/* Dropdown within container demo */}
      <WithinContainer />
    </>
  );
}

function WithinContainer() {
  const [isOpen, setOpen] = useState(false);

  const [placement, setPlacement] = useState("right-start" as Placement);
  const [padding, setPadding] = useState(100);
  const [offset, setOffset] = useState(5);
  const [preventScroll, setPreventScroll] = useState(true);

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
    <div className="relative h-[90vh] w-screen bg-gray-50">
      <span style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl bg-green-100 shadow-borderXL"></span>
      <span className="pointer-events-none absolute left-52 top-36 select-none px-2 py-3 text-green-500">Padding</span>

      {/* Boundary */}
      <div
        style={{ insetInline: 200 + padding, top: 150 + padding, bottom: 50 + padding }}
        className="absolute overflow-hidden rounded-lg border-2 border-gray-200 bg-white"
      >
        <span className="rounded-br-lg bg-gray-200 p-1 pr-1.5">Boundary</span>
      </div>

      {/* Menu bar */}
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="h-3 w-3 cursor-default rounded-full bg-red-450" />
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="h-3 w-3 rounded-full bg-green-600" />
        </div>

        <h2 className="font-medium text-gray-800">Within Container</h2>

        <p className="absolute right-4 flex gap-2 text-sm font-medium text-gray-800">Tip: use scroll</p>
      </div>

      {/* Sliders & Checkbox */}
      <div style={{ top: 35 }} className="absolute inset-x-0 flex items-end justify-center gap-5 text-xs">
        <div className="relative flex flex-col items-center justify-center">
          <span className="pb-1">Padding: {padding}px</span>
          <Input
            type="range"
            step={50}
            min={0}
            max={250}
            value={padding}
            onInput={(e) => setPadding(Number(e.currentTarget.value))}
            className="w-full rounded p-0.5"
          />
        </div>

        <div className="relative flex flex-col items-center justify-center">
          <span className="pb-1">Offset: {offset}px</span>
          <Input
            type="range"
            step={6}
            min={0}
            max={30}
            value={offset}
            onInput={(e) => setOffset(Number(e.currentTarget.value))}
            className="w-full rounded p-0.5"
          />
        </div>

        <div className="relative flex flex-col items-center justify-center text-sm">
          <Checkbox isChecked={preventScroll} setIsChecked={setPreventScroll}>
            Prevent scroll
          </Checkbox>
        </div>
      </div>

      {/* Placement */}
      <div>
        <div style={{ insetInline: 200, top: 160 }} className="absolute z-30 flex justify-center gap-5">
          <Button
            onClick={() => setPlacement("top-start")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top-start" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("top")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("top-end")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "top-end" && "bg-gray-800")}
          />
        </div>

        {/* left */}
        <div style={{ top: 150, bottom: 50, left: 210 }} className="absolute z-30 flex flex-col justify-center gap-5">
          <Button
            onClick={() => setPlacement("left-start")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left-start" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("left")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("left-end")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "left-end" && "bg-gray-800")}
          />
        </div>

        {/* right */}
        <div style={{ top: 150, bottom: 50, right: 210 }} className="absolute z-30 flex flex-col justify-center gap-5">
          <Button
            onClick={() => setPlacement("right-start")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right-start" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("right")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("right-end")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "right-end" && "bg-gray-800")}
          />
        </div>

        {/* bottom */}
        <div style={{ insetInline: 200, bottom: 60 }} className="absolute z-30 flex justify-center gap-5">
          <Button
            onClick={() => setPlacement("bottom-start")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom-start" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("bottom")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom" && "bg-gray-800")}
          />
          <Button
            onClick={() => setPlacement("bottom-end")}
            variant="appear"
            size="icon"
            className={cn("h-6 w-6 rounded-full border-2 border-gray-800 hover:scale-110", placement === "bottom-end" && "bg-gray-800")}
          />
        </div>
      </div>

      {/* Dropdown */}
      <div
        id="center"
        ref={centerRef}
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 overflow-auto rounded-b-xl"
      >
        <main style={{ width: "calc(200% - 59px)", height: "calc(200% - 34px)" }} className="relative flex items-center justify-center">
          <Dropdown
            isOpen={isOpen}
            setOpen={setOpen}
            listLength={6}
            skipIndexes={[1]}
            placement={placement}
            container={{ selector: "main", padding }}
            offset={offset}
            preventScroll={preventScroll}
            className="w-40"
            buttonProps={{
              className: "border border-gray-600 bg-gray-700 font-medium text-gray-100",
              children: isOpen ? "close" : "open",
            }}
          >
            <span className="absolute inset-x-2 -top-8 rounded-lg bg-orange-200 text-center text-xs leading-relaxed shadow-borderXL">
              Tip: use arrow keys
            </span>
            <DropdownOption index={0} variant="primary">
              Primary
            </DropdownOption>
            <DropdownOption index={1} variant="primary">
              Disabled
            </DropdownOption>

            <DropdownGroupTitle title="Actions" divider />
            <DropdownOption index={2}>Action 1</DropdownOption>
            <DropdownOption index={3}>Action 2</DropdownOption>

            <DropdownGroupTitle title="Danger" divider />
            <DropdownOption index={4} variant="danger" className="rounded-b-lg">
              Danger
            </DropdownOption>
          </Dropdown>

          {/* Rulers */}
          <div style={{ paddingBlock: "15px" }} className="absolute -z-50 w-full border-y-4 border-double border-black/5" />
          <div style={{ paddingInline: "29px" }} className="absolute -z-50 h-full border-x-4 border-double border-black/5" />
        </main>
      </div>
    </div>
  );
}
