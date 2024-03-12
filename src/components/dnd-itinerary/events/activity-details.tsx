import { memo, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { UpdateEventData } from "@/server/routers/event";
import { EVENT_IMG_FALLBACK } from "@/lib/config";
import { EASING } from "@/lib/framer-motion";
import { cn } from "@/lib/utils";
import { Event, KEY } from "@/types";

import Icon from "@/components/icons";
import { Button, ButtonVariants, Input, ScrollIndicator, TextArea } from "@/components/ui";
import { Floating } from "@/components/ui/floating";

// todo - render activity as the trigger in triggerProps instead of a span
// todo - Add Google Maps integration to activity details

// todo - Individual input undo buttons
// todo - Control-z undo (at least one back)
// todo - Shift-control-z redo (at least one forward)
// todo - History of changes (at least 10) for undo/redo
// todo - Opening hours in tooltip
// todo - Editable Opening hours
// todo - Cost currency dropdown
// todo - Icons with tooltip for controls or instead of text (not 100% sure about this)
// todo - Tooltip info icon with created at and updated at dates
// todo - upload photo/link to change activity photo
// todo - way to remove/choose photo

// activity details height: borderHeight + imageHeight + NameHeight + controlsHeight -> 8 + 164 + 44 + 48 = 264
const DETAILS_CONST_HEIGHT = 264;
const DETAILS_SECTION_INITIAL_HEIGHT = 246;

type ActivityDetailsProps = {
  event: Event;
  eventCacheRef: React.MutableRefObject<Event>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEvent: (event: Event) => void;
  onDelete: () => void;
  onClose: (event: Event, eventCache: Event) => void;
};
export const ActivityDetails = memo(function ActivityDetails({
  event,
  eventCacheRef,
  isOpen,
  setIsOpen,
  setEvent,
  onDelete: handleDelete,
  onClose: handleClose,
}: ActivityDetailsProps) {
  const inputScrollRef = useRef<HTMLInputElement | null>(null);

  const [name, setName] = useState(event.name);
  const [address, setAddress] = useState(event.address);
  const [phoneNumber, setPhoneNumber] = useState(event.phoneNumber);
  const [cost, setCost] = useState(event.cost);
  const [website, setWebsite] = useState(event.website);
  const [note, setNote] = useState(event.note);

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
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0)",
      },
      animate: {
        width: "320px",
        height: `${detailsHeight + DETAILS_CONST_HEIGHT}px`,
        borderWidth: "4px",
        borderRadius: "16px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.03), 0 2px 2px rgba(0,0,0,0.03), 0 4px 4px rgba(0,0,0,0.03), 0 8px 8px rgba(0,0,0,0.03), 0 12px 12px rgba(0,0,0,0.03), 0px 16px 16px rgba(0,0,0,0.03), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba05,0,0,0)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
      exit: {
        width: "160px",
        height: "112px",
        borderWidth: "2px",
        borderRadius: "8px",
        boxShadow:
          "0 0 0 1px hsl(232, 9%, 90%), 0 0 5px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.02), 0 4px 4px rgba(0,0,0,0.02), 0 8px 8px rgba(0,0,0,0.02), 0 16px 16px rgba(0,0,0,0.02), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0), 0px 0 0px rgba(0,0,0,0)",
        transition: { ease: EASING.anticipate, duration: 0.6 },
      },
    }),
    [detailsHeight],
  );

  const handleChange = (data: UpdateEventData) => {
    setEvent({ ...event, ...data });
  };

  const handleCancel = () => {
    handleUndo();
    setIsOpen(false);
  };

  const handleUndo = () => {
    setEvent(eventCacheRef.current);
    setName(eventCacheRef.current.name);
    setAddress(eventCacheRef.current.address);
    setPhoneNumber(eventCacheRef.current.phoneNumber);
    setCost(eventCacheRef.current.cost);
    setWebsite(eventCacheRef.current.website);
    setNote(eventCacheRef.current.note);
  };

  return (
    <Floating
      isOpen={isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        if (state === true) eventCacheRef.current = event;
        else handleClose(event, eventCacheRef.current);
      }}
      initialFocus={-1}
      placement="top-start"
      offset={({ rects }) => ({ mainAxis: -rects.reference.height - (rects.floating.height - rects.reference.height) })}
      shift={false}
      flip={false}
      size={false}
      customAnimation={animation}
      exitDuration={625}
      zIndex={30}
      className="mb-5 mr-5 h-28 w-40 overflow-hidden rounded-lg border-2 border-white bg-white text-sm"
      triggerProps={{
        asChild: true,
        tabIndex: -1,
        className: "absolute select-none inset-0 pointer-events-none invisible",
        children: <span />,
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
            src={`${event?.photo ? `/api/get-google-image?photoRef=${event.photo}&width=156&height=82` : EVENT_IMG_FALLBACK}`}
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
            value={name}
            onChange={(e) => handleChange({ name: e.target.value })}
            onInput={(e) => setName(e.currentTarget.value)}
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
                value={address ?? ""}
                onChange={(e) => handleChange({ address: e.target.value })}
                onInput={(e) => setAddress(e.currentTarget.value)}
                minRows={1}
                maxRows={4}
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
                  value={phoneNumber ?? ""}
                  onChange={(e) => handleChange({ phoneNumber: e.target.value })}
                  onInput={(e) => setPhoneNumber(e.currentTarget.value)}
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
                  value={cost || ""}
                  onChange={(e) => handleChange({ cost: parseFloat(e.target.value) })}
                  onInput={(e) => setCost(parseFloat(e.currentTarget.value))}
                  onKeyDown={(e) => e.code === KEY.Backspace && e.currentTarget.value.length === 0 && setCost(null)}
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
                value={website ?? ""}
                onChange={(e) => handleChange({ website: e.target.value })}
                onInput={(e) => setWebsite(e.currentTarget.value)}
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
                value={note ?? ""}
                onChange={(e) => handleChange({ note: e.target.value })}
                onInput={(e) => setNote(e.currentTarget.value)}
                minRows={2}
                maxRows={4}
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
          className="mt-1 flex w-[312px] items-end justify-between rounded-xl p-1 text-sm"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.3 }}
          transition={{ ease: EASING.anticipate, duration: isOpen ? 0.3 : 0.6 }}
        >
          <span className="flex h-9">
            <Button
              onClick={handleCancel}
              variant="scale"
              size="unset"
              className="w-20 before:rounded-lg before:bg-gray-100 before:shadow-none"
              animatePress
            >
              Cancel
            </Button>

            <Button
              onClick={handleUndo}
              variant="scale"
              size="unset"
              className="w-20 before:rounded-lg before:bg-gray-100 before:shadow-none"
              animatePress
            >
              Undo All
            </Button>

            {/* Google Maps */}
            {!!event.url && (
              <Link
                href={event.url}
                target="_blank"
                className={cn(
                  "flex w-9 items-center justify-center before:rounded-lg before:bg-gray-100 before:shadow-none",
                  ButtonVariants({ variant: "scale", size: "unset" }),
                )}
              >
                <Icon.googleMapsIcon className="h-4" />
              </Link>
            )}
          </span>

          <Button
            onClick={handleDelete}
            variant="scale"
            size="unset"
            className="flex h-9 w-20 items-center justify-center gap-1.5 fill-red-500 text-red-500 before:rounded-lg before:bg-red-500 before:shadow-none hover:fill-white hover:text-white focus:fill-white focus:text-white"
          >
            <Icon.trash className="h-3.5" />
            Delete
          </Button>
        </motion.div>
      </>
    </Floating>
  );
});
