import { memo, useEffect, useRef } from "react";
// import Link from "next/link";
import { motion } from "framer-motion";

import { type HistoryActions } from "~/hooks/use-history-state";
import { EASING } from "~/lib/motion";
import { cn, os } from "~/lib/utils";
import type { PlaceDetailsSchema } from "~/lib/types";

import PlaceImage from "./place-image";
import { Button, Icons, Input, ScrollIndicator, TextArea } from "~/components/ui";

// * test/proposal - render activity as the trigger in triggerProps instead of a span

// todo - Embedded Map with marker at address
// todo - Opening hours in tooltip
// todo - Editable Opening hours
// todo - Add Start and End time
// todo - Cost currency dropdown
// todo - Tooltip info icon with created at and updated at dates
// todo - way to upload photo/link to change/remove activity photo and change image index in array

type Props = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  details: PlaceDetailsSchema;
  setDetails: (valueOrIndex: PlaceDetailsSchema | number, desc?: string) => void;
  historyActions: HistoryActions<PlaceDetailsSchema>;
  detailsRef: (element: HTMLDivElement | null) => void;
  detailsHeight: number;
  onDelete: () => void;
};
export const PlaceDetails = memo(function ActivityDetails({
  isOpen,
  setIsOpen,
  details,
  setDetails,
  historyActions,
  detailsRef,
  detailsHeight,
  onDelete: handleDelete,
}: Props) {
  const inputScrollRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (data: Partial<PlaceDetailsSchema>) => {
    setDetails({ ...details, ...data });
  };
  const handleUpdate = (data: Partial<PlaceDetailsSchema>) => {
    setDetails({ ...details, ...data }, "Update event");
  };
  const handleCancel = () => {
    setDetails(historyActions.initialValue);
    setTimeout(() => setIsOpen(false));
  };

  // Handle undo/redo shortcuts
  useEffect(() => {
    window.addEventListener("keydown", historyActions.handleShortcut);
    return () => window.removeEventListener("keydown", historyActions.handleShortcut);
  }, [historyActions.handleShortcut]);

  return (
    <>
      {/* Image */}
      <motion.div
        className={cn(
          "relative h-[82px] flex-shrink-0 overflow-hidden",
          isOpen ? "cursor-default" : "cursor-pointer",
        )}
        initial={{ height: "82px" }}
        animate={{ height: "164px" }}
        exit={{ height: "82px" }}
        transition={{ ease: EASING.anticipate, duration: 0.6 }}
      >
        <PlaceImage src={details.imageUrl} size={82} />
      </motion.div>

      {/* Name */}
      <motion.div
        className="group relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-800"
        initial={{ height: "24px", marginTop: "2px", fontSize: "14px" }}
        animate={{ height: "44px", marginTop: "0px", fontSize: "16px" }}
        exit={{ height: "24px", marginTop: "2px", fontSize: "14px" }}
        transition={{ ease: EASING.anticipate, duration: 0.6 }}
      >
        <Input
          ref={inputScrollRef}
          name="activity name"
          placeholder="name"
          value={details.name ?? ""}
          onUpdate={(e) => handleUpdate({ name: e.target.value })}
          onInput={(e) => handleChange({ name: e.currentTarget.value })}
          variant="unset"
          size="unset"
          className={{ container: "h-full w-full", input: "h-full" }}
          preventEmpty
        />
        <ScrollIndicator scrollRef={inputScrollRef} />
      </motion.div>

      {/* Details */}
      <motion.div
        className="w-[312px] flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 text-sm"
        initial={{ opacity: 0.3, height: "0px" }}
        animate={{ opacity: 1, height: `${detailsHeight}px` }}
        exit={{ opacity: 0.3, height: "0px" }}
        transition={{ ease: EASING.anticipate, duration: 0.6 }}
      >
        <div ref={detailsRef} className="flex flex-col gap-1.5 px-2 py-2">
          {/* Address */}
          <div className="relative">
            <label
              htmlFor="address"
              className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500"
            >
              Address
            </label>

            <TextArea
              id="address"
              placeholder="street, city, country"
              value={details.address ?? ""}
              onChange={(e) => handleChange({ address: e.target.value })}
              onUpdate={(e) => handleUpdate({ address: e.target.value })}
              minRows={1}
              maxRows={3}
              variant="unset"
              size="unset"
              style={{ transitionProperty: "box-shadow" }}
              className="m-0 flex-shrink-0 rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
            />
          </div>

          {/* Phone number*/}
          <div className="relative">
            <label
              htmlFor="phone"
              className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500"
            >
              Phone
            </label>

            <Input
              id="phone"
              placeholder="xxx xxx xxxx"
              value={details.phoneNumber ?? ""}
              onChange={(e) => handleChange({ phoneNumber: e.target.value })}
              onUpdate={(e) => handleUpdate({ phoneNumber: e.target.value })}
              variant="unset"
              size="unset"
              className={{
                input:
                  "rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus",
              }}
            />
          </div>

          {/* Website */}
          <div className="relative">
            <label
              htmlFor="website"
              className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500"
            >
              Website
            </label>

            <Input
              id="website"
              placeholder="www.example.com"
              value={details.website ?? ""}
              onUpdate={(e) => handleUpdate({ website: e.target.value })}
              onChange={(e) => handleChange({ website: e.target.value })}
              variant="unset"
              size="unset"
              className={{
                input:
                  "rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus",
              }}
            />
          </div>

          {/* Note */}
          <div className="relative">
            <label
              htmlFor="note"
              className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500"
            >
              Note
            </label>

            <TextArea
              id="note"
              placeholder="..."
              value={details.note ?? ""}
              onChange={(e) => handleChange({ note: e.target.value })}
              onUpdate={(e) => handleUpdate({ note: e.target.value })}
              minRows={2}
              maxRows={5}
              variant="unset"
              size="unset"
              style={{ transitionProperty: "box-shadow" }}
              className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
            />
          </div>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        className="mt-1 flex w-[312px] rounded-xl p-1 text-sm"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0.3 }}
        transition={{ ease: EASING.anticipate, duration: isOpen ? 0.3 : 0.6 }}
      >
        {/* Cancel */}
        <Button
          onClick={handleCancel}
          variant="scale"
          size="unset"
          className="flex h-9 w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none"
          animatePress
          tooltip={{
            zIndex: 40,
            children: "Cancel",
          }}
        >
          <Icons.cancel className="h-4 w-4 scale-100" />
        </Button>

        {/* Undo */}
        <Button
          onClick={historyActions.undo}
          variant="scale"
          size="icon"
          className="flex w-9 items-center justify-center p-0 before:rounded-lg before:bg-gray-100 before:shadow-none"
          animatePress
          disabled={!historyActions.canUndo}
          tooltip={{
            zIndex: 40,
            className: "flex gap-1.5 items-center",
            children: (
              <>
                Undo
                <span className="text-xs text-gray-500">{os() === "macos" ? "⌘" : "Ctrl"}+Z</span>
              </>
            ),
          }}
        >
          <Icons.undo className="h-full w-3.5 scale-100 overflow-visible" />
        </Button>

        {/* Redo */}
        <Button
          onClick={historyActions.redo}
          variant="scale"
          size="unset"
          className="flex h-9 w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none"
          animatePress
          disabled={!historyActions.canRedo}
          tooltip={{
            zIndex: 40,
            className: "flex gap-1.5 items-center",
            children: (
              <>
                Redo
                <span className="text-xs text-gray-500">
                  {os() === "macos" ? "⌘" : "Ctrl"}+Shift+Z
                </span>
              </>
            ),
          }}
        >
          <Icons.redo className="h-full w-3.5 scale-100 overflow-visible" />
        </Button>

        {/* Google Maps */}
        {/* {!!event.activity.url && (
          <Button
            tabIndex={-1}
            variant="scale"
            size="unset"
            className="flex h-9 w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none before:focus-within:scale-100 before:focus-within:opacity-100"
            animatePress
            tooltip={{ zIndex: 40, children: "Google Maps" }}
          >
            <Link
              href={event.activity.url}
              target="_blank"
              className="flex h-full w-full items-center justify-center"
            >
              <Icons.googleMapsIcon className="h-4 w-full scale-100" />
            </Link>
          </Button>
        )} */}

        {/* Delete */}
        <Button
          onClick={handleDelete}
          variant="scale"
          size="unset"
          className="ml-auto flex h-9 items-center justify-center gap-1.5 fill-red-500 px-2.5 text-red-500 before:rounded-lg before:bg-red-500 before:shadow-none hover:fill-white hover:text-white focus:fill-white focus:text-white"
        >
          <Icons.trash className="h-full w-3 scale-100" />
          Delete
        </Button>
      </motion.div>
    </>
  );
});
