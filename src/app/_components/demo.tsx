"use client";

import { useRef, useState } from "react";

import Window from "~/components/window";
import DemoLibrary from "./demo/demo-library";
import DemoTasks from "./demo/demo-tasks";
import DemoTripEditor from "./demo/demo-trip";
import useDemoLibrary, { DEMO_LIMITS } from "./demo/use-demo-library";
import { Icons } from "~/components/ui";
import { cn } from "~/lib/utils";

export default function Demo() {
  const library = useDemoLibrary();
  const [selectedId, setSelectedId] = useState<string | null>();
  const [hintsOpen, setHintsOpen] = useState(true);
  const hintsButton = useRef<HTMLButtonElement>(null);
  const activeId = selectedId === undefined ? library.initialTripId : selectedId;
  const activeTrip = library.trips.find((trip) => trip.id === activeId);

  const openLibrary = () => {
    setSelectedId(null);
    library.complete("library");
  };

  return (
    <section
      className="mx-auto max-w-[1600px] scroll-mt-20 px-0 pb-24 pt-16 font-inter sm:px-4 sm:pb-32 sm:pt-24"
      aria-labelledby="demo-heading"
    >
      <div className="mb-10 text-center">
        <h2
          id="demo-heading"
          className="font-belanosima text-3xl font-semibold text-gray-700 sm:text-4xl"
        >
          Take Kolumbus for a spin
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-500">
          A little room for your next big adventure. Explore a ready-made trip, then make a plan of
          your own.
        </p>
      </div>

      <div id="demo" className="scroll-mt-20">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-[11px] leading-relaxed text-gray-400">
            Local demo · {DEMO_LIMITS.trips} trips · {DEMO_LIMITS.days} days per trip ·{" "}
            {DEMO_LIMITS.places} places per trip
          </p>
          <button
            ref={hintsButton}
            type="button"
            aria-expanded={hintsOpen}
            aria-controls="demo-tasks-window"
            onClick={() => setHintsOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 shadow-sm hover:border-kolumblue-300 hover:text-kolumblue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kolumblue-500"
          >
            <Icons.clipboardPin aria-hidden="true" className="size-3.5 fill-current" />
            {hintsOpen ? "Things to try" : "Show things to try"}
            <span className="rounded-full bg-kolumblue-50 px-1.5 py-0.5 text-[10px] text-kolumblue-600">
              {library.completed.length}/8
            </span>
          </button>
        </div>
        <div
          className={cn(
            "grid items-start gap-6",
            hintsOpen && "lg:grid-cols-[minmax(0,1fr)_280px]",
          )}
        >
          <Window
            title="Kolumbus"
            isOpen
            containerClassName="w-full min-w-0"
            className="flex h-[clamp(500px,74vh,680px)] w-full min-w-0 flex-col p-0"
          >
            {!library.loaded ? (
              <div className="flex min-h-[500px] items-center justify-center text-sm text-gray-400">
                Opening your next adventure…
              </div>
            ) : activeTrip ? (
              <DemoTripEditor
                key={activeTrip.id}
                initialTrip={activeTrip}
                onSave={library.save}
                onComplete={library.complete}
                onLibrary={openLibrary}
              />
            ) : (
              <DemoLibrary
                trips={library.trips}
                onOpen={setSelectedId}
                onCreate={(details) => {
                  const id = library.create(undefined, details);
                  if (id) setSelectedId(id);
                }}
                onExample={() => {
                  const id = library.create(0);
                  if (id) setSelectedId(id);
                }}
                onDuplicate={library.duplicate}
                onDelete={library.remove}
              />
            )}
            <div className="mt-auto flex min-h-10 shrink-0 items-center justify-between gap-2 border-t border-gray-100 bg-white px-4 text-[11px] text-gray-400 sm:px-6">
              <span role="status">
                {library.storageAvailable
                  ? "Saved in this browser"
                  : "Changes stay in this tab — browser storage is unavailable"}
              </span>
              {activeTrip && (
                <div
                  id="trash-container"
                  className="flex h-10 w-16 flex-shrink-0 items-center justify-center"
                  aria-label="Drop a place here to delete it"
                />
              )}
            </div>
          </Window>
          <aside id="demo-tasks-window" hidden={!hintsOpen}>
            <Window
              title="Things to try"
              isOpen
              onClose={() => {
                setHintsOpen(false);
                hintsButton.current?.focus();
              }}
              containerClassName="w-full min-w-0"
              className="max-h-[clamp(500px,74vh,680px)] w-full overflow-y-auto p-0"
            >
              <DemoTasks completed={library.completed} />
            </Window>
          </aside>
        </div>
      </div>
    </section>
  );
}
