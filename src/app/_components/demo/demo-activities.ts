import type { ItinerarySchema } from "~/lib/validations/trip";

export const demoChapters = [
  {
    label: "Move",
    title: "Find your rhythm",
    tasks: [
      {
        id: "reorder",
        title: "Reorder a day",
        hint: "Drag a place by its photo and drop it before or after another place in the same day.",
      },
      {
        id: "transfer",
        title: "Try another day",
        hint: "Drag one place into the other day. Drop it beside a place or into the empty space at the end of the row.",
      },
      {
        id: "multiple",
        title: "Move a pair together",
        hint: "Hold ⌘ on Mac or Ctrl on Windows and click two places in the same day. Then drag either card to move the pair together. Press Escape or click outside to clear the selection.",
      },
      {
        id: "move-day",
        title: "Take the whole day with you",
        hint: "Drag a blue Day label above or below another day. Its places move together; the calendar dates stay in their slots. Escape cancels a drag before you drop.",
      },
    ],
  },
  {
    label: "Shape",
    title: "Make it your own",
    tasks: [
      {
        id: "add",
        title: "Find your next stop",
        hint: "Click + at the end of a day and search Google Places. You can also type your own place name and press Enter.",
      },
      {
        id: "details",
        title: "Add a personal touch",
        hint: "Click a place card to open it. Edit its name or add a note, then click outside the card to save.",
      },
      {
        id: "remove",
        title: "Leave something out",
        hint: "Drag a place to the bin that appears at the bottom of the app. A selected pair can go together, too. Use Undo afterwards if you want it back.",
      },
      {
        id: "dates",
        title: "Pick a different weekend",
        hint: "Open the blue calendar in the trip toolbar. Pick a start and end date, then click outside the calendar to apply.",
      },
    ],
  },
  {
    label: "Keep",
    title: "Keep your plans close",
    tasks: [
      {
        id: "history",
        title: "Look back at your changes",
        hint: "Open History to see your changes and jump to an earlier version. The toolbar arrows also undo and redo. Try ⌘/Ctrl+Z, or add Shift to redo.",
      },
      {
        id: "library",
        title: "Visit your library",
        hint: "Use Library at the top left of the app. Your trips and tutorial progress are saved in this browser, without an account.",
      },
      {
        id: "create",
        title: "Start a fresh adventure",
        hint: "In the library, click New trip. Give it a name, choose dates and start collecting your own places.",
      },
      {
        id: "duplicate",
        title: "Give a trip another life",
        hint: "Open the three-dot menu on a trip cover and choose Duplicate. It makes a separate copy, ready for a different idea.",
      },
    ],
  },
] as const;

export const demoTaskIds = demoChapters.flatMap((chapter) => chapter.tasks.map((task) => task.id));
export type DemoTaskId = (typeof demoTaskIds)[number];

export function countDemoActivities(completed: string[]) {
  return demoTaskIds.filter((id) => completed.includes(id)).length;
}

export function getDemoMoveTask(
  before: ItinerarySchema,
  after: ItinerarySchema,
  description: string,
): DemoTaskId | null {
  if (description === "Move day") {
    return before.some((day, index) => day.id !== after[index]?.id) ? "move-day" : null;
  }
  if (!description.startsWith("Move")) return null;

  const previous = new Map(
    before.flatMap((day) =>
      day.places.map((place, index) => [place.id, { dayId: day.id, index }] as const),
    ),
  );
  const moved = after.flatMap((day) =>
    day.places.flatMap((place, index) => {
      const origin = previous.get(place.id);
      return origin && (origin.dayId !== day.id || origin.index !== index)
        ? [{ from: origin.dayId, to: day.id }]
        : [];
    }),
  );
  if (!moved.length) return null;
  if (/^Move \d+ places$/.test(description)) return "multiple";
  return moved.some((place) => place.from !== place.to) ? "transfer" : "reorder";
}
