import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import useHistoryState from "@/hooks/use-history-state";
import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { EASING } from "@/lib/framer-motion";
import { cn, getOS } from "@/lib/utils";
import { Event } from "@/types";

import Icon from "@/components/icons";
import { Button, Input, ScrollIndicator, TextArea } from "@/components/ui";
import { Floating } from "@/components/ui/floating";

// todo - Decouple logic from floating component so only when it is open state will be created

// * test/proposal - render activity as the trigger in triggerProps instead of a span
// todo - Add map with marker for the activity

// todo - Opening hours in tooltip
// todo - Editable Opening hours
// todo - Add Start and End time
// todo - Cost currency dropdown
// todo - Icons with tooltip for controls or instead of text (not 100% sure about this)
// todo - Tooltip info icon with created at and updated at dates
// todo - upload photo/link to change activity photo
// todo - way to remove/choose photo

// activity details height: borderHeight + imageHeight + NameHeight + controlsHeight -> 8 + 164 + 44 + 48 = 264
const DETAILS_CONST_HEIGHT = 264;
const DETAILS_SECTION_INITIAL_HEIGHT = 246;

type ActivityDetailsProps = {
  activity: Event;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: (event: Event) => void;
  onDelete: () => void;
};
export const ActivityDetails = memo(function ActivityDetails({
  activity,
  isOpen,
  setIsOpen,
  onClose: handleClose,
  onDelete: handleDelete,
}: ActivityDetailsProps) {
  const inputScrollRef = useRef<HTMLInputElement | null>(null);
  const [details, setDetails, { initialValue, canUndo, canRedo, undo, redo, addEntry, handleUndoRedoShortcut }] = useHistoryState(
    {
      name: activity.name,
      address: activity.address,
      phoneNumber: activity.phoneNumber,
      cost: activity.cost,
      website: activity.website,
      note: activity.note,
    },
    { keepInitial: true },
  );

  type detailsUpdateData = { name?: string; address?: string; phoneNumber?: string; cost?: number; website?: string; note?: string };

  const handleChange = (data: detailsUpdateData) => addEntry({ ...details, ...data });
  const handleInput = (data: detailsUpdateData) => setDetails({ ...details, ...data });
  const handleCancel = () => {
    setDetails(initialValue);
    setTimeout(() => setIsOpen(false));
  };

  // Handle undo/redo shortcuts
  useEffect(() => {
    window.addEventListener("keydown", handleUndoRedoShortcut);
    return () => window.removeEventListener("keydown", handleUndoRedoShortcut);
  }, [handleUndoRedoShortcut]);

  //#region Height observer
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const [detailsHeight, setDetailsHeight] = useState(DETAILS_SECTION_INITIAL_HEIGHT);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || !entries.length) return;
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
  //#endregion

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
        height: `${detailsHeight + DETAILS_CONST_HEIGHT}px`,
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
        handleClose({ ...activity, ...details });
      }}
      placement="top-start"
      offset={({ rects }) => ({ mainAxis: -rects.reference.height - (rects.floating.height - rects.reference.height) })}
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
        children: <span tabIndex={-1} className="pointer-events-none invisible absolute -inset-0.5 select-none opacity-0" />,
      }}
    >
      <>
        {/* Image */}
        <motion.div
          className={cn("relative h-[82px] flex-shrink-0", isOpen ? "cursor-default" : "cursor-pointer")}
          initial={{ height: "82px" }}
          animate={{ height: "164px" }}
          exit={{ height: "82px" }}
          transition={{ ease: EASING.anticipate, duration: 0.6 }}
        >
          <Image
            src={`${activity?.photo ? `/api/get-google-image?photoRef=${activity.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
            alt="Event Image"
            className="select-none object-cover object-center"
            sizes="156px"
            priority
            fill
          />
        </motion.div>

        {/* Name */}
        <motion.div
          className="group relative mx-1 mt-0.5 flex h-6 flex-shrink-0 items-center overflow-hidden whitespace-nowrap bg-transparent text-sm text-gray-900"
          initial={{ height: "24px", marginTop: "2px", fontSize: "14px" }}
          animate={{ height: "44px", marginTop: "0px", fontSize: "16px" }}
          exit={{ height: "24px", marginTop: "2px", fontSize: "14px" }}
          transition={{ ease: EASING.anticipate, duration: 0.6 }}
        >
          <Input
            ref={inputScrollRef}
            name="activity name"
            placeholder="name"
            value={details.name}
            onChange={(e) => handleChange({ name: e.target.value })}
            onInput={(e) => handleInput({ name: e.currentTarget.value })}
            variant="unset"
            size="unset"
            className="h-full"
            preventEmpty
            fullWidth
            fullHeight
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
              <label htmlFor="address" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                Address
              </label>

              <TextArea
                id="address"
                placeholder="street, city, country"
                value={details.address ?? ""}
                onChange={(e) => handleChange({ address: e.target.value })}
                onInput={(e) => handleInput({ address: e.currentTarget.value })}
                minRows={1}
                maxRows={3}
                variant="unset"
                size="unset"
                style={{ transitionProperty: "box-shadow" }}
                className="m-0 flex-shrink-0 rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
              />
            </div>

            {/* Phone number & Cost */}
            <div className="flex gap-1.5">
              <div className="relative flex-1 flex-shrink-0">
                <label htmlFor="phone" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                  Phone
                </label>

                <Input
                  id="phone"
                  placeholder="xxx xxx xxxx"
                  value={details.phoneNumber ?? ""}
                  onChange={(e) => handleChange({ phoneNumber: e.target.value })}
                  onInput={(e) => handleInput({ phoneNumber: e.currentTarget.value })}
                  variant="unset"
                  size="unset"
                  className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                />
              </div>

              <div className="relative w-24 flex-shrink-0">
                <label htmlFor="cost" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                  Cost
                </label>

                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  value={details.cost || ""}
                  onChange={(e) => handleChange({ cost: parseFloat(e.target.value) >= 0 ? parseFloat(e.target.value) : 0 })}
                  onInput={(e) => handleInput({ cost: parseFloat(e.currentTarget.value) >= 0 ? parseFloat(e.currentTarget.value) : 0 })}
                  variant="unset"
                  size="unset"
                  className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
                />
              </div>
            </div>

            {/* Website */}
            <div className="relative">
              <label htmlFor="website" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                Website
              </label>

              <Input
                id="website"
                placeholder="www.example.com"
                value={details.website ?? ""}
                onChange={(e) => handleChange({ website: e.target.value })}
                onInput={(e) => handleInput({ website: e.currentTarget.value })}
                variant="unset"
                size="unset"
                className="rounded-md bg-transparent px-2 pb-1 pt-6 duration-200 ease-kolumb-flow hover:shadow-border focus:bg-white focus:shadow-focus"
              />
            </div>

            {/* Note */}
            <div className="relative">
              <label htmlFor="note" className="absolute left-2 top-1.5 text-xs font-semibold tracking-tight text-gray-500">
                Note
              </label>

              <TextArea
                id="note"
                placeholder="..."
                value={details.note ?? ""}
                onChange={(e) => handleChange({ note: e.target.value })}
                onInput={(e) => handleInput({ note: e.currentTarget.value })}
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
            <Icon.cancel className="h-4 w-4 scale-100" />
          </Button>

          {/* Undo */}
          <Button
            onClick={undo}
            variant="scale"
            size="icon"
            className="flex w-9 items-center justify-center p-0 before:rounded-lg before:bg-gray-100 before:shadow-none"
            animatePress
            disabled={!canUndo}
            tooltip={{
              zIndex: 40,
              className: "flex gap-1.5 items-center",
              children: (
                <>
                  Undo
                  <span className="text-xs text-gray-500">{getOS() === "macos" ? "⌘" : "Ctrl"}+Z</span>
                </>
              ),
            }}
          >
            <Icon.undo className="h-full w-3.5 scale-100 overflow-visible" />
          </Button>

          {/* Redo */}
          <Button
            onClick={redo}
            variant="scale"
            size="unset"
            className="flex h-9 w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none"
            animatePress
            disabled={!canRedo}
            tooltip={{
              zIndex: 40,
              className: "flex gap-1.5 items-center",
              children: (
                <>
                  Redo
                  <span className="text-xs text-gray-500">{getOS() === "macos" ? "⌘" : "Ctrl"}+Shift+Z</span>
                </>
              ),
            }}
          >
            <Icon.redo className="h-full w-3.5 scale-100 overflow-visible" />
          </Button>

          {/* Google Maps */}
          {!!activity.url && (
            <Button
              tabIndex={-1}
              variant="scale"
              size="unset"
              className="flex h-9 w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none before:focus-within:scale-100 before:focus-within:opacity-100"
              animatePress
              tooltip={{ zIndex: 40, children: "Google Maps" }}
            >
              <Link href={activity.url} target="_blank" className="flex h-full w-full items-center justify-center">
                <Icon.googleMapsIcon className="h-4 w-full scale-100" />
              </Link>
            </Button>
          )}

          {/* Delete */}
          <Button
            onClick={handleDelete}
            variant="scale"
            size="unset"
            className="ml-auto flex h-9 items-center justify-center gap-1.5 fill-red-500 px-2.5 text-red-500 before:rounded-lg before:bg-red-500 before:shadow-none hover:fill-white hover:text-white focus:fill-white focus:text-white"
          >
            <Icon.trash className="h-full w-3 scale-100" />
            Delete
          </Button>
        </motion.div>
      </>
    </Floating>
  );
});
