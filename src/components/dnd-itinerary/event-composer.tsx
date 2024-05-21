import { memo, useRef, useState } from "react";

import { api } from "~/trpc/react";
import { useDndItineraryContext } from "./dnd-context";
import type { Day } from "~/lib/validations/trip";
import { EASING } from "~/lib/motion";
import { cn, createId } from "~/lib/utils";

import { Button, Icons, Spinner } from "../ui";
import { Floating } from "../ui/floating/floating";
import { Combobox } from "../ui/combobox";

// todo - Add <Toast /> component to display api errors

const ACTIVITY_WIDTH = 160;
const GAP_WIDTH = 8;

type Prediction = {
  value: string;
  secondaryValue?: string;
  valueSubstring?: { length: number; offset: number }[];
  secondaryValueSubstring?: { length: number; offset: number }[];
  placeId?: string;
};

type EventComposerProps = {
  day: Day;
  dayIndex: number;
  dragging: boolean;
};
export const EventComposer = memo(function EventComposer({
  day,
  dayIndex,
  dragging,
}: EventComposerProps) {
  const { userId, tripId, eventCount, eventLimit } = useDndItineraryContext();

  const autocomplete = api.external.googleAutocomplete.useMutation();
  const details = api.external.googleDetails.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [predictionList, setPredictionList] = useState<Prediction[]>([]);
  const [sessionToken, setSessionToken] = useState(createId());
  const [loading, setLoading] = useState(false);
  const activePredictionRef = useRef<Prediction | null>(null);

  const handleInput = async (value: string) => {
    if (eventCount >= eventLimit) return;

    setLoading(true);
    autocomplete.mutate(
      { searchValue: value, sessionToken },
      {
        onSuccess(data) {
          if (data.status === "OK") {
            setPredictionList(
              data.predictions.map((prediction) => ({
                value: prediction.structured_formatting.main_text,
                secondaryValue: prediction.structured_formatting.secondary_text,
                valueSubstring: prediction.structured_formatting.main_text_matched_substrings,
                secondaryValueSubstring:
                  prediction.structured_formatting.secondary_text_matched_substrings,
                placeId: prediction.place_id,
              })),
            );
          } else if (data.status === "ZERO_RESULTS") {
            setPredictionList([]);
          } else {
            setPredictionList([]);
            console.error(`Google Places API status: ${data.status}.`);
            console.error(
              "Please contact at pawel@kolumbus.app with API status to resolve this issue.",
            );
          }
        },
        onError(error) {
          setPredictionList([]);
          console.error(`Unexpected error occurred: ${error.message}`);
        },
      },
    );
  };

  // const handleAdd = () => {
  //   if (eventCount >= eventLimit) return;

  //   const prediction = activePredictionRef.current;
  //   const event = EVENT_TEMPLATE({
  //     id: createId(),
  //     tripId,
  //     date: day.date,
  //     position: day.events.length,
  //     createdBy: userId,
  //   });

  //   if (prediction === null) {
  //     event.name = inputValue;
  //     createEvent(event, dayIndex, day.events.length);
  //   } else if (prediction.placeId) {
  //     setSaving(true);
  //     event.placeId = prediction.placeId;
  //     details.mutate(
  //       {
  //         place_id: prediction.placeId,
  //         fields: FieldsGroup.Basic + FieldsGroup.Contact,
  //         language: LANGUAGES.English,
  //         sessionToken,
  //       },
  //       {
  //         onSuccess(data) {
  //           const place = data.result;

  //           event.name = place.name ?? event.name;
  //           event.photo = place.photos?.[0]?.photo_reference ?? event.photo;
  //           event.address = place.formatted_address ?? event.address;
  //           event.phoneNumber =
  //             place.international_phone_number ??
  //             place.international_phone_number ??
  //             event.phoneNumber;
  //           event.url = place.url ?? event.url;
  //           event.website = place.website ?? event.website;
  //           event.openingHours = place.opening_hours ?? event.openingHours;

  //           createEvent(event, dayIndex, day.events.length);
  //         },
  //         onError: (error: unknown) => console.error(error),
  //         onSettled: () => setSaving(false),
  //       },
  //     );
  //   } else {
  //     event.name = prediction.text;
  //     createEvent(event, dayIndex, day.events.length);
  //   }

  //   setIsOpen(false);
  //   handleClear();
  //   setSessionToken(cuid2.createId());
  // };

  const handleClear = () => {
    if (inputValue === "" && predictionList.length === 0) setIsOpen(false);

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
      customAnimation={{
        initial: { width: "32px", height: "112px" },
        animate: {
          width: "312px",
          height: "48px",
          transition: { ease: EASING.anticipate, duration: 0.6 },
        },
        exit: {
          width: "32px",
          height: "112px",
          transition: { ease: EASING.anticipate, duration: 0.6 },
        },
      }}
      trapFocus
      scrollIntoView
      zIndex={30}
      style={{ width: "322px" }}
      className={cn(
        "relative my-auto mr-4 flex h-28 w-8 origin-top-left flex-col items-center first:ml-0",
        isExpanded && "rounded-b-none duration-300 ease-kolumb-flow",
      )}
      triggerProps={{
        onClick: () => setIsOpen(true),
        variant: "unset",
        size: "unset",
        style: { transitionProperty: "fill, box-shadow" },
        className: cn(
          "ml-2 flex h-28 w-8 items-center rounded-lg bg-white fill-gray-400 px-2 shadow-floating duration-300 ease-kolumb-out first:ml-0 hover:fill-gray-700 hover:shadow-floatingHover hover:ease-kolumb-flow dark:bg-gray-800 dark:fill-gray-600 dark:hover:fill-gray-400",
          dragging && "absolute duration-250",
        ),
        animate: {
          opacity: isOpen ? 0 : 1,
          left: day.events.length * (ACTIVITY_WIDTH + GAP_WIDTH),
          width: isOpen ? "312px" : "32px",
          pointerEvents: isOpen ? "none" : "auto",
        },
        transition: {
          duration: 0,
          delay: isOpen ? 0 : 0.6,
          left: { ease: EASING.easeOut, duration: 0.25 },
        },
        children: <Icons.plus className="h-4 w-4" />,
      }}
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
          // onEnterPress={handleAdd}
          initial={{ opacity: 0, paddingLeft: "0px" }}
          animate={{ opacity: 1, paddingLeft: "16px" }}
          exit={{ opacity: 0, paddingLeft: "0px" }}
          transition={{ ease: EASING.anticipate, duration: 0.6 }}
          containerProps={{
            className:
              "relative z-10 flex h-full items-center rounded-2xl bg-white fill-gray-400 dark:fill-gray-600 text-sm",
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
            // onClick={handleAdd}
            variant="unset"
            size="unset"
            className="h-full rounded-none duration-100 hover:fill-gray-800 focus-visible:fill-gray-800 dark:hover:fill-gray-300 dark:focus-visible:fill-gray-300"
            initial={{ width: "32px", paddingInline: "8px", pointerEvents: "none" }}
            animate={{
              width: "42px",
              paddingInline: "14px",
              pointerEvents: "auto",
              transition: { ease: EASING.anticipate, duration: 0.6, pointerEvents: { delay: 0.6 } },
            }}
            exit={{
              width: "32px",
              paddingInline: "8px",
              pointerEvents: "none",
              transition: { ease: EASING.anticipate, duration: 0.6 },
            }}
            tooltip={{ placement: "bottom", offset: 0, arrow: true, zIndex: 30, children: "Add" }}
          >
            <Icons.plus className="h-4 w-4" />
          </Button>

          <Button
            onClick={handleClear}
            variant="unset"
            size="unset"
            className="h-full overflow-hidden rounded-none duration-100 hover:fill-gray-800 focus-visible:fill-gray-800 dark:hover:fill-gray-300 dark:focus-visible:fill-gray-300"
            initial={{ width: "0px", paddingInline: "0px", pointerEvents: "none" }}
            animate={{
              width: "42px",
              paddingInline: "14px",
              pointerEvents: "auto",
              transition: {
                ease: EASING.anticipate,
                duration: 0.3,
                delay: 0.1,
                pointerEvents: { delay: 0.6 },
              },
            }}
            exit={{
              width: "0px",
              paddingInline: "0px",
              pointerEvents: "none",
              transition: { ease: EASING.anticipate, duration: 0.3 },
            }}
            tooltip={{ placement: "bottom", offset: 0, arrow: true, zIndex: 30, children: "Clear" }}
          >
            <Icons.x className="h-3.5 w-3.5" />
          </Button>
        </Combobox.Input>

        <Combobox.List
          width={{ initial: 280, target: 312 }}
          height={{ option: 52, padding: 14, min: 30 }}
          className="rounded-b-2xl"
        >
          {predictionList.map((prediction, index) => (
            <Combobox.Option
              key={prediction.value + index}
              index={index}
              className="before:last:rounded-b-xl"
            >
              <div className="w-10 flex-shrink-0">
                <Icons.pin className="mx-auto w-2.5 fill-gray-400" />
              </div>

              <div className="flex h-9 w-[252px] flex-col justify-center pr-4">
                <span className="truncate">{prediction.value}</span>
                {prediction.secondaryValue && (
                  <span className="truncate text-xs text-gray-500">
                    {prediction.secondaryValue}
                  </span>
                )}
              </div>
            </Combobox.Option>
          ))}

          {predictionList.length === 0 && (
            <div className="flex w-full items-center justify-center text-xs font-medium text-gray-400">
              {loading ? <Spinner.default size="sm" /> : "No results"}
            </div>
          )}
        </Combobox.List>
      </Combobox.Root>
    </Floating>
  );
});
