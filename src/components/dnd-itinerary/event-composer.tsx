import { memo, useRef, useState } from "react";
import { motion } from "framer-motion";
import cuid2 from "@paralleldrive/cuid2";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata";
import { useDndItineraryContext } from "./dnd-context";
import { EVENT_TEMPLATE } from "@/data/template-data";
import { EASING } from "@/lib/framer-motion";
import { cn, deepCloneItinerary } from "@/lib/utils";
import { Day, Event, FieldsGroup, Itinerary, LANGUAGE, UT } from "@/types";

import Icon from "../icons";
import { Button, Spinner } from "../ui";
import { Floating } from "../ui/floating/floating";
import { Combobox } from "../ui/combobox";

// todo - Add <Toast /> component to display api errors

const EVENT_GAP_WIDTH = 168;

type Prediction = { value: string; secondaryValue?: string; matchedSubstring?: { length: number; offset: number }[]; placeId?: string };

type EventComposerProps = {
  activeId: string | null;
  itinerary: Itinerary;
  day: Day;
};
export const EventComposer = memo(function EventComposer({ activeId, itinerary, day }: EventComposerProps) {
  const { userTrips, dispatchUserTrips, selectedTrip, setSaving } = useAppdata();
  const { userId, tripId } = useDndItineraryContext();

  const create = api.event.create.useMutation();
  const autocomplete = api.google.autocomplete.useMutation();
  const details = api.google.details.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [predictionList, setPredictionList] = useState<Prediction[]>([]);
  const [sessionToken, setSessionToken] = useState(cuid2.createId());
  const [loading, setLoading] = useState(false);
  const activePredictionRef = useRef<Prediction | null>(null);

  const handleInput = async (value: string) => {
    setLoading(true);
    autocomplete.mutate(
      { searchValue: value, language: LANGUAGE.English, sessionToken },
      {
        onSuccess(data) {
          if (data.status === "OK") {
            setPredictionList(
              data.predictions.map((prediction) => ({
                value: prediction.structured_formatting.main_text,
                secondaryValue: prediction.structured_formatting.secondary_text,
                matchedSubstring: prediction.structured_formatting.main_text_matched_substrings,
                placeId: prediction.place_id,
              })),
            );
          } else if (data.status === "ZERO_RESULTS") {
            setPredictionList([]);
          } else {
            setPredictionList([]);
            console.error(`Google Places API status: ${data.status}.`);
            console.error("Please contact at pawel@kolumbus.app with API status to resolve this issue.");
          }
        },
        onError(error) {
          setPredictionList([]);
          console.error(`Unexpected error occurred: ${error.message}`);
        },
        onSettled: () => setLoading(false),
      },
    );
  };

  const handleAdd = () => {
    const clonedItinerary = deepCloneItinerary(itinerary);
    const prediction = activePredictionRef.current;
    const event = EVENT_TEMPLATE({
      id: cuid2.createId(),
      tripId: userTrips[selectedTrip].id,
      date: day.date,
      position: day.events.length,
      createdBy: userId,
    });

    const createEvent = (event: Event, settle: boolean) => {
      dispatchUserTrips({ type: UT.CREATE_EVENT, payload: { tripId, event } });
      create.mutate(event, {
        onSuccess(updatedEvent) {
          if (!updatedEvent) return;
          dispatchUserTrips({
            type: UT.UPDATE_EVENT,
            payload: { tripId, event: { ...event, createdAt: updatedEvent.createdAt, updatedAt: updatedEvent.updatedAt } },
          });
        },
        onError,
        onSettled: () => settle && setSaving(false),
      });
    };
    const onError = (error: unknown) => {
      console.error(error);
      dispatchUserTrips({ type: UT.REPLACE_ITINERARY, payload: { tripId, itinerary: clonedItinerary } });
    };

    if (prediction === null) {
      event.name = inputValue;
      setSaving(true);
      createEvent(event, true);
    } else if (prediction.placeId) {
      event.placeId = prediction.placeId;
      setSaving(true);
      details.mutate(
        { place_id: prediction.placeId, fields: FieldsGroup.Basic + FieldsGroup.Contact, language: LANGUAGE.English, sessionToken },
        {
          onSuccess(data) {
            const place = data.result;

            event.name = place.name ?? event.name;
            event.photo = place.photos?.[0]?.photo_reference ?? event.photo;
            event.address = place.formatted_address ?? event.address;
            event.phoneNumber = place.international_phone_number ?? place.international_phone_number ?? event.phoneNumber;
            event.url = place.url ?? event.url;
            event.website = place.website ?? event.website;
            event.openingHours = place.opening_hours ?? event.openingHours;

            createEvent(event, false);
          },
          onError,
          onSettled: () => setSaving(false),
        },
      );
    } else {
      event.name = prediction.value;
      setSaving(true);
      createEvent(event, true);
    }

    setIsOpen(false);
    handleClear();
    setSessionToken(cuid2.createId());
  };

  const handleClear = () => {
    activePredictionRef.current = null;
    setIsExpanded(false);
    setInputValue("");
    setPredictionList([]);
  };

  return (
    <Floating
      isOpen={isOpen}
      onOpenChange={(state) => {
        setIsOpen(state);
        handleClear();
      }}
      placement="top-start"
      offset={({ rects }) => ({ mainAxis: (-rects.reference.height - rects.floating.height) / 2 })}
      shift={false}
      flip={false}
      size={false}
      animation={null}
      exitDuration={625}
      zIndex={30}
      className="flex h-28 items-center"
      triggerProps={{
        onClick: () => setIsOpen(true),
        variant: "unset",
        size: "unset",
        style: { transitionProperty: "fill, box-shadow" },
        className: cn(
          "ml-2 flex h-28 w-8 items-center rounded-lg bg-white fill-gray-400 px-2 shadow-floating duration-300 ease-kolumb-out first:ml-0 hover:fill-gray-700 hover:shadow-floatingHover hover:ease-kolumb-flow",
          activeId && "absolute duration-250",
        ),
        animate: {
          opacity: isOpen ? 0 : 1,
          left: day.events.length * EVENT_GAP_WIDTH,
          transition: { opacity: { duration: 0, delay: isOpen ? 0 : 0.6 }, left: { ease: EASING.easeOut, duration: 0.25 } },
        },
        children: <Icon.plus className="h-4 w-4" />,
      }}
    >
      <motion.div
        className={cn(
          "relative my-auto mr-5 flex h-28 w-8 origin-top-left flex-col first:ml-0",
          isExpanded && "rounded-b-none duration-300 ease-kolumb-flow",
        )}
        initial={{ width: "32px", height: "112px" }}
        animate={{ width: "312px", height: "48px" }}
        exit={{ width: "32px", height: "112px" }}
        transition={{ ease: EASING.anticipate, duration: 0.6 }}
      >
        <Combobox.Root
          open={isExpanded}
          setOpen={setIsExpanded}
          inputValue={inputValue}
          setInputValue={setInputValue}
          activeItemRef={activePredictionRef}
          list={predictionList}
          className="h-full w-full"
        >
          <Combobox.Input
            placeholder="Search or enter name"
            onInputChange={handleInput}
            onEnterPress={handleAdd}
            initial={{ opacity: 0, paddingLeft: "0px" }}
            animate={{ opacity: 1, paddingLeft: "16px" }}
            exit={{ opacity: 0, paddingLeft: "0px" }}
            transition={{ ease: EASING.anticipate, duration: 0.6 }}
            containerProps={{
              className: "relative z-10 flex h-full items-center rounded-2xl bg-white fill-gray-400 text-sm",
              initial: {
                paddingRight: "0px",
                borderRadius: "8px 8px 8px 8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 -1px 0px rgba(0,0,0,0.02)",
              },
              animate: {
                paddingRight: "84px",
                borderRadius: isExpanded ? "16px 16px 0px 0px" : "16px 16px 16px 16px",
                boxShadow: isExpanded
                  ? "0px 0px 2px rgba(0,0,0,0.2), 0px -1px 0px rgba(0,0,0,0.02)"
                  : "0px 2px 4px rgba(0,0,0,0.15), 0px -1px 0px rgba(0,0,0,0.02)",
              },
              exit: {
                paddingRight: "0px",
                borderRadius: "8px 8px 8px 8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.15), 0 -1px 0px rgba(0,0,0,0.02)",
              },
              transition: { ease: EASING.anticipate, duration: 0.6 },
            }}
          >
            <Button
              onClick={handleAdd}
              variant="unset"
              size="unset"
              className="h-full rounded-none duration-100 hover:fill-gray-800 focus-visible:fill-gray-800"
              initial={{ width: "32px", paddingInline: "8px", pointerEvents: "none" }}
              animate={{
                width: "42px",
                paddingInline: "14px",
                pointerEvents: "auto",
                transition: { pointerEvents: { delay: 0.6 } },
              }}
              exit={{ width: "32px", paddingInline: "8px", pointerEvents: "none" }}
              transition={{ ease: EASING.anticipate, duration: 0.6 }}
              tooltip={{ placement: "bottom", offset: 0, arrow: true, zIndex: 30, children: "Add" }}
            >
              <Icon.plus className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleClear}
              variant="unset"
              size="unset"
              className="h-full overflow-hidden rounded-none duration-100 hover:fill-gray-800 focus-visible:fill-gray-800"
              initial={{ opacity: 0, width: "0px", paddingInline: "0px", pointerEvents: "none" }}
              animate={{
                opacity: 1,
                width: "42px",
                paddingInline: "14px",
                pointerEvents: "auto",
                transition: { delay: 0.1, pointerEvents: { delay: 0.6 } },
              }}
              exit={{ opacity: 0, width: "0px", paddingInline: "0px", pointerEvents: "none" }}
              transition={{ ease: EASING.anticipate, duration: 0.3 }}
              tooltip={{ placement: "bottom", offset: 0, arrow: true, zIndex: 30, children: "Clear" }}
            >
              <Icon.x className="h-3.5 w-3.5" />
            </Button>
          </Combobox.Input>

          <Combobox.List width={{ initial: 280, target: 312 }} height={{ option: 52, padding: 14, min: 30 }} className="rounded-b-2xl">
            {predictionList.map((prediction, index) => (
              <Combobox.Option key={prediction.value + index} index={index} className="before:last:rounded-b-xl">
                <div className="w-10 flex-shrink-0">
                  <Icon.pin className="mx-auto w-2.5 fill-gray-400" />
                </div>

                <div className="flex h-9 w-[252px] flex-col justify-center pr-4">
                  <span className="truncate">{prediction.value}</span>
                  {prediction.secondaryValue && <span className="truncate text-xs text-gray-500">{prediction.secondaryValue}</span>}
                </div>
              </Combobox.Option>
            ))}

            {predictionList.length === 0 && (
              <div className="flex w-full items-center justify-center text-xs font-medium text-gray-400">
                {loading ? <Spinner size="xs" /> : "No results"}
              </div>
            )}
          </Combobox.List>
        </Combobox.Root>
      </motion.div>
    </Floating>
  );
});
