"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateRange, RangeFocus, RangeKeyDict } from "react-date-range";
import { addDays } from "date-fns";

import api from "@/app/_trpc/client";
import useAppdata from "@/context/appdata-provider";
import { ROLE_BASED_LIMITS } from "@/lib/config";
import { calculateDays, formatDate, generateItinerary } from "@/lib/utils";
import { deepCloneItinerary } from "@/lib/utils";
import { Trip, Day, Event, UT } from "@/types";

import { Button, ButtonProps } from "../ui";
import { Floating } from "../ui/floating";
import { ExcludedDaysModal } from "./excluded-days-modal";

// Import the styles for the date picker
import "@/lib/react-date-range/styles.css";
import "@/lib/react-date-range/date-display.css";
import "@/lib/react-date-range/navigation.css";

// todo: decouple functionality to increase modularity (e.g. handleFocusChange, handleApply, handleDeleteEvents)

export default function DatePicker({ activeTrip, buttonProps }: { activeTrip: Trip; buttonProps: ButtonProps }) {
  const { dispatchUserTrips, setSaving } = useAppdata();
  const updateTrip = api.trips.update.useMutation();
  const deleteEvent = api.event.delete.useMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const [selecting, setSelecting] = useState(false);
  const [focusedRange, setFocusedRange] = useState([0, 0] as RangeFocus);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(activeTrip.startDate),
    endDate: new Date(activeTrip.endDate),
    key: "selection",
  });

  const daysToDeleteRef = useRef<Day[]>([]);
  const eventsToDeleteRef = useRef<Event[]>([]);
  const newDatesRef = useRef({ startDate: new Date(activeTrip.startDate), endDate: new Date(activeTrip.endDate) });

  const minDateLimit = useMemo(() => addDays(dateRange.startDate, -ROLE_BASED_LIMITS["explorer"].daysLimit + 1), [dateRange.startDate]);
  const maxDateLimit = useMemo(() => addDays(dateRange.startDate, ROLE_BASED_LIMITS["explorer"].daysLimit - 1), [dateRange.startDate]);
  const minDate = useMemo(() => (selecting ? minDateLimit : new Date("2023-01-01")), [selecting, minDateLimit]);
  const maxDate = useMemo(() => (selecting ? maxDateLimit : addDays(new Date(), 1095)), [selecting, maxDateLimit]);

  const updateTripData = (startDate: string, endDate: string) => {
    const trip = { ...activeTrip };
    const events = trip.itinerary.flatMap((day) => day.events);
    const itinerary = generateItinerary(startDate, endDate, events);
    const cachedItinerary = deepCloneItinerary(trip.itinerary);

    setSaving(true);
    dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, startDate, endDate, itinerary } });
    updateTrip.mutate(
      { tripId: trip.id, data: { startDate, endDate } },
      {
        onSuccess(updatedTrip) {
          if (!updatedTrip) return;
          dispatchUserTrips({
            type: UT.UPDATE_TRIP,
            trip: { ...trip, startDate, endDate, updatedAt: updatedTrip.updatedAt, itinerary },
          });
        },
        onError(error) {
          console.error(error);
          dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...trip, itinerary: cachedItinerary } });
        },
        onSettled: () => setSaving(false),
      },
    );
  };

  const handleChange = (item: RangeKeyDict) => {
    const startDate = item.selection.startDate ?? dateRange.startDate;
    const endDate = item.selection.endDate ?? dateRange.endDate;

    if (calculateDays(startDate, endDate) > ROLE_BASED_LIMITS["explorer"].daysLimit) return;

    setDateRange({ ...dateRange, ...item.selection });
  };

  const handleFocusChange = (newFocusedRange: RangeFocus) => {
    setFocusedRange(newFocusedRange);
    if (newFocusedRange[1] === 1) setSelecting(true);
    else setSelecting(false);
  };

  const handleApply = () => {
    setIsOpen(false);

    const rangeStartDate = new Date(formatDate(dateRange.startDate));
    const rangeEndDate = new Date(formatDate(dateRange.endDate));
    const startDate = new Date(activeTrip.startDate);
    const endDate = new Date(activeTrip.endDate);
    newDatesRef.current = { startDate: rangeStartDate, endDate: rangeEndDate };

    if (formatDate(startDate) === formatDate(rangeStartDate) && formatDate(endDate) === formatDate(rangeEndDate)) return;

    // If the new start and end dates are within selected date range, update the trip and exit (no conflicts).
    if (rangeStartDate.getTime() <= startDate.getTime() && endDate.getTime() <= rangeEndDate.getTime()) {
      updateTripData(formatDate(rangeStartDate), formatDate(rangeEndDate));
      return;
    }

    const lastIndex = activeTrip.itinerary.length - 1;
    const startOffset = startDate <= rangeStartDate ? calculateDays(rangeStartDate, startDate, false) : 0;
    const endOffset = endDate >= rangeEndDate ? lastIndex - calculateDays(rangeEndDate, endDate, false) : lastIndex;

    daysToDeleteRef.current = activeTrip.itinerary.filter((_, index) => index < startOffset || index > endOffset);
    eventsToDeleteRef.current = daysToDeleteRef.current.flatMap((day) => day.events);

    // If there are no events to delete, update the trip and exit (no conflicts).
    if (eventsToDeleteRef.current.length === 0) {
      updateTripData(formatDate(rangeStartDate), formatDate(rangeEndDate));
      return;
    }

    // Show a confirmation modal if events scheduled on days being deleted
    // Are affected by the date change, requiring user input to proceed.
    setIsOpenModal(true);
  };

  const handleDeleteEvents = () => {
    updateTripData(formatDate(newDatesRef.current.startDate), formatDate(newDatesRef.current.endDate));
    setIsOpenModal(false);
    setSaving(true);

    // Delete the events scheduled on the days being deleted.
    eventsToDeleteRef.current.forEach((event) => {
      dispatchUserTrips({ type: UT.DELETE_EVENT, payload: { event, tripId: activeTrip.id } });
      deleteEvent.mutate(
        { eventId: event.id },
        {
          onError(error) {
            console.error(error);
            dispatchUserTrips({ type: UT.UPDATE_TRIP, trip: { ...activeTrip, itinerary: deepCloneItinerary(activeTrip.itinerary) } });
          },
          onSettled: () => setSaving(false),
        },
      );
    });
  };

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setDateRange({ startDate: new Date(activeTrip.startDate), endDate: new Date(activeTrip.endDate), key: "selection" });
  }, [activeTrip.startDate, activeTrip.endDate]);

  // Reset date range when the picker is closed
  useEffect(() => {
    if (!isOpen) handleCancel();
  }, [isOpen, handleCancel]);

  // Update date range when the trip's start and end dates change
  useEffect(() => {
    setDateRange({ startDate: new Date(activeTrip.startDate), endDate: new Date(activeTrip.endDate), key: "selection" });
  }, [activeTrip.startDate, activeTrip.endDate]);

  return (
    <>
      <Floating
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        placement="bottom-end"
        offset={{ mainAxis: 3, crossAxis: 12 }}
        flip={false}
        click={{ enabled: true }}
        animation="fadeInScale"
        className="origin-top-right rounded-xl border bg-white shadow-floating dark:border-gray-700 dark:bg-gray-900"
        rootSelector="#action-bar"
        triggerProps={{ ...buttonProps, tooltip: { ...buttonProps.tooltip!, disabled: isOpen } }}
      >
        <DateRange
          ranges={[dateRange]}
          rangeColors={["hsl(210, 78%, 60%)"]}
          onChange={handleChange}
          focusedRange={focusedRange}
          onRangeFocusChange={handleFocusChange}
          dateDisplayFormat="d MMM yyyy"
          weekdayDisplayFormat="EEEEE"
          minDate={minDate}
          maxDate={maxDate}
          weekStartsOn={1}
          scroll={{ enabled: true, monthHeight: 212, longMonthHeight: 244, calendarHeight: 228 }}
        />

        {/* Controls */}
        <div className="flex gap-2 px-2 pb-2">
          <Button
            onClick={handleCancel}
            animatePress
            variant="unset"
            className="w-full rounded-md bg-gray-100 text-xs font-medium text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            animatePress
            variant="unset"
            size="lg"
            className="w-full rounded-md bg-kolumblue-100 text-xs font-medium text-kolumblue-600 hover:bg-kolumblue-200"
          >
            Apply
          </Button>
        </div>
      </Floating>

      <ExcludedDaysModal
        open={isOpenModal}
        setOpen={setIsOpenModal}
        daysToDelete={daysToDeleteRef.current}
        onDeleteEvents={handleDeleteEvents}
      />
    </>
  );
}
