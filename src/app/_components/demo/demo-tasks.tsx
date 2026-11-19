"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { Icons } from "~/components/ui";

const tasks = [
  {
    id: "add",
    title: "Find your first stop",
    hint: "Click the + at the end of a day. Search for a place, or type a name and press Enter to add your own.",
  },
  {
    id: "move",
    title: "Move things around",
    hint: "Drag a place to another day. You can also drag the blue Day label to move an entire day.",
  },
  {
    id: "details",
    title: "Make a place your own",
    hint: "Click a place card to open its details. Add a note or change its name, then click outside to save.",
  },
  {
    id: "multiple",
    title: "Try a little shortcut",
    hint: "Hold ⌘ on Mac or Ctrl on Windows and click two places in the same day. Drag either card to move them together.",
  },
  {
    id: "dates",
    title: "Pick a different weekend",
    hint: "Click the blue calendar at the right of the trip toolbar. Choose a start and end date, then click outside the calendar to apply.",
  },
  {
    id: "history",
    title: "Change your mind",
    hint: "Open History in the toolbar. Jump back to an earlier version of your plan, or use the undo and redo arrows.",
  },
  {
    id: "library",
    title: "Visit your library",
    hint: "Use Library at the top left of the app. Your trips are saved automatically in this browser.",
  },
  {
    id: "create",
    title: "Plan something of your own",
    hint: "In your library, click New trip for a fresh plan. You can also duplicate a trip and take it in a new direction.",
  },
];

export default function DemoTasks({ completed }: { completed: string[] }) {
  const [expanded, setExpanded] = useState("add");
  const count = tasks.filter((task) => completed.includes(task.id)).length;

  return (
    <div className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-belanosima text-xl font-semibold text-gray-700">
            A little adventure
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Get a feel for Kolumbus. Pick something to try.
          </p>
        </div>
        <span
          className="whitespace-nowrap rounded-full bg-kolumblue-50 px-2 py-1 text-xs font-medium text-kolumblue-600"
          aria-label={`${count} of ${tasks.length} activities explored`}
        >
          {count}/{tasks.length}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Demo activities"
        aria-valuemin={0}
        aria-valuemax={tasks.length}
        aria-valuenow={count}
        className="mb-5 h-1.5 overflow-hidden rounded-full bg-gray-100"
      >
        <div
          className="h-full rounded-full bg-kolumblue-400 transition-all duration-500"
          style={{ width: `${(count / tasks.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-1">
        {tasks.map((task) => {
          const done = completed.includes(task.id);
          const open = expanded === task.id;
          return (
            <li key={task.id} className={cn("rounded-xl", open && "bg-gray-50")}>
              <button
                className="flex w-full items-center gap-2.5 rounded-xl px-2 py-3 text-left text-xs font-medium text-gray-600 focus-visible:ring-2 focus-visible:ring-kolumblue-300"
                onClick={() => setExpanded(open ? "" : task.id)}
                aria-expanded={open}
                aria-controls={`demo-task-${task.id}`}
              >
                <span
                  className={cn(
                    "flex size-5 flex-shrink-0 items-center justify-center rounded-full border border-gray-200",
                    done && "border-emerald-200 bg-emerald-50",
                  )}
                >
                  {done && <Icons.check className="size-2.5 fill-emerald-600" />}
                </span>
                <span className={cn("flex-1", done && "text-gray-400")}>{task.title}</span>
                <Icons.chevron
                  className={cn("size-2 fill-gray-400 transition-transform", open && "rotate-180")}
                />
              </button>
              {open && (
                <p
                  id={`demo-task-${task.id}`}
                  className="px-3 pb-4 pl-10 text-xs leading-relaxed text-gray-500"
                >
                  {task.hint}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      {count === tasks.length && (
        <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-700">
          You’ve found your way around. Where will your next adventure take you?
        </p>
      )}
    </div>
  );
}
