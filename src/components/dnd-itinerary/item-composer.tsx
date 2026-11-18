import { memo, useEffect, useRef, useState } from "react";

import { isShowcase } from "~/config/site";
import { api } from "~/trpc/react";
import { useDndItineraryContext } from "./dnd-context";
import type { DaySchema } from "~/lib/validations/trip";
import { EASING } from "~/lib/motion";
import { cn, createId } from "~/lib/utils";

import { Button, Icons, Spinner } from "../ui";
import { Floating } from "../ui/floating/floating";
import { Combobox } from "../ui/combobox";
import { toastHandler } from "~/lib/trpc";
import {
  FieldsGroup,
  PlacesAutocompleteResponse,
  PlacesDetailsResponse,
} from "~/lib/validations/google";
import { constructPlace } from "~/lib/constructors";
import { ITEM_GAP, PLACE_WIDTH } from "~/lib/constants";

type Prediction = {
  value: string;
  secondaryValue?: string;
  valueSubstring?: { length: number; offset: number }[];
  secondaryValueSubstring?: { length: number; offset: number }[];
  placeId?: string;
};

type EventComposerProps = {
  day: DaySchema;
  dayIndex: number;
  dragging: boolean;
};
export const EventComposer = memo(function EventComposer({
  day,
  dayIndex,
  dragging,
}: EventComposerProps) {
  const { userId, tripId, createItem, placeCount, placeLimit } = useDndItineraryContext();

  const autocomplete = api.external.googleAutocomplete.useMutation(toastHandler());
  const details = api.external.googleDetails.useMutation(toastHandler());

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const [inputValue, setInputValue] = useState("");
  const [predictionList, setPredictionList] = useState<Prediction[]>([]);
  const [sessionToken, setSessionToken] = useState(createId());
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const searchRequest = useRef(0);
  const currentDay = useRef({ day, dayIndex, createItem, placeCount, placeLimit });
  currentDay.current = { day, dayIndex, createItem, placeCount, placeLimit };

  useEffect(
    () => () => {
      searchRequest.current++;
    },
    [],
  );

  const handleChange = async (searchValue: string) => {
    const request = ++searchRequest.current;
    setPredictionList([]);
    setSearchError(null);
    if (!searchValue.trim() || placeCount >= placeLimit) {
      setLoading(false);
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (request !== searchRequest.current) return;

    try {
      let data;
      if (isShowcase) {
        const params = new URLSearchParams({
          action: "autocomplete",
          input: searchValue,
          sessionToken,
        });
        const response = await fetch(`/api/places?${params.toString()}`);
        if (!response.ok) throw new Error("Google Places is unavailable");
        data = PlacesAutocompleteResponse.parse(await response.json());
      } else {
        data = await autocomplete.mutateAsync({ searchValue, sessionToken });
      }
      if (request !== searchRequest.current) return;
      if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
        throw new Error("Google Places is unavailable");
      }
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
    } catch {
      if (request === searchRequest.current) {
        setSearchError("Search unavailable. Press Enter to add your own place.");
      }
    } finally {
      if (request === searchRequest.current) setLoading(false);
    }
  };

  const handleAdd = async (value: unknown) => {
    const prediction = value as Prediction | null;

    const name = inputValue.trim();
    if (adding || placeCount >= placeLimit || (!prediction && !name)) return;
    const request = ++searchRequest.current;
    setLoading(false);

    const place = constructPlace({
      userId,
      tripId,
      dayIndex: dayIndex,
      sortIndex: day.places.length,
    });

    place.name = prediction?.value ?? name;
    if (prediction?.placeId) {
      setAdding(true);
      place.googleId = prediction.placeId;
      try {
        let data;
        if (isShowcase) {
          const params = new URLSearchParams({
            action: "details",
            placeId: prediction.placeId,
            sessionToken,
          });
          const response = await fetch(`/api/places?${params.toString()}`);
          if (!response.ok) throw new Error("Place details are unavailable");
          data = PlacesDetailsResponse.parse(await response.json());
        } else {
          data = await details.mutateAsync({
            place_id: prediction.placeId,
            fields: FieldsGroup.Basic + FieldsGroup.Contact,
            sessionToken,
          });
        }
        if (data.status !== "OK") throw new Error("Place details are unavailable");
        const { result } = data;
        place.name = result.name ?? place.name;
        place.imageUrl = result.photos?.[0]?.photo_reference
          ? `ref:${result.photos[0].photo_reference}`
          : place.imageUrl;
        place.address = result.formatted_address ?? place.address;
        place.phoneNumber = result.international_phone_number ?? place.phoneNumber;
        place.website = result.website ?? place.website;
      } catch {
        // Keep the selected place available when its details cannot be loaded.
      } finally {
        if (request === searchRequest.current) setAdding(false);
      }
    }

    if (request !== searchRequest.current) return;
    const current = currentDay.current;
    if (current.placeCount >= current.placeLimit) return;
    place.dayIndex = current.dayIndex;
    place.sortIndex = current.day.places.length;
    current.createItem(place);
    searchRequest.current++;
    setIsOpen(false);
    setInputValue("");
    setPredictionList([]);
    setIsExpanded(false);
    setSessionToken(createId());
  };

  const handleClear = () => {
    searchRequest.current++;
    setLoading(false);
    setAdding(false);
    setSearchError(null);
    if (inputValue === "" && predictionList.length === 0) setIsOpen(false);
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
      shift={{ padding: 12 }}
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
        "aria-label": "Add a place",
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
          left: day.places.length * (PLACE_WIDTH + ITEM_GAP),
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
        list={predictionList}
        className="h-full w-full"
      >
        <Combobox.Input
          placeholder="Add a place"
          onChange={handleChange}
          onEnterPress={handleAdd}
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
            onClick={() => handleAdd(null)}
            disabled={adding}
            variant="unset"
            size="unset"
            className="h-full overflow-hidden rounded-none duration-100 hover:fill-gray-800 focus-visible:fill-gray-800 dark:hover:fill-gray-300 dark:focus-visible:fill-gray-300"
            initial={{ width: "0px", paddingInline: "0px", pointerEvents: "none" }}
            animate={{
              width: "44px",
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
            tooltip={{
              placement: "bottom",
              offset: 0,
              arrow: true,
              zIndex: 30,
              children: "Add custom place",
            }}
          >
            <Icons.pin className="h-4 w-4" />
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
              onClick={() => handleAdd(prediction)}
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
              {loading || adding ? <Spinner.default size="sm" /> : (searchError ?? "No results")}
            </div>
          )}
          {predictionList.length > 0 && (
            <div translate="no" className="px-3 pt-2 text-right text-xs font-normal text-gray-600">
              Google Maps
            </div>
          )}
        </Combobox.List>
      </Combobox.Root>
    </Floating>
  );
});
