"use client";

import { useRef, useState } from "react";

import Window from "~/components/window";
import DemoLibrary from "./demo/demo-library";
import DemoTasks from "./demo/demo-tasks";
import DemoTripEditor from "./demo/demo-trip";
import useDemoLibrary, { DEMO_LIMITS } from "./demo/use-demo-library";
import { Icons } from "~/components/ui";
import { cn } from "~/lib/utils";
import ColorBlock from "./color-block";
import ShowcaseSection from "./showcase-section";
import { countDemoActivities, demoTaskIds } from "./demo/demo-activities";

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
    <ShowcaseSection
      id="demo"
      tone="graphite"
      last
      title={
        <>
          Take Kolumbus for a
          <ColorBlock className="-rotate-3 bg-orange-400 text-gray-800 selection:bg-orange-100 selection:text-orange-700 hover:rotate-6">
            spin
          </ColorBlock>
        </>
      }
    >
      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-[11px] leading-relaxed text-white/75">
            Local demo · max {DEMO_LIMITS.trips} trips · max {DEMO_LIMITS.days} days per trip · max{" "}
            {DEMO_LIMITS.places} places per trip
          </p>
          <button
            ref={hintsButton}
            type="button"
            aria-expanded={hintsOpen}
            aria-controls="demo-tasks-window"
            onClick={() => setHintsOpen((open) => !open)}
            className="flex items-center gap-2 rounded px-1 py-1 text-xs text-white/60 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
          >
            <Icons.clipboardPin aria-hidden="true" className="size-3 fill-current" />
            {hintsOpen ? "Hide things to try" : "Show things to try"}
            <span className="font-inconsolata text-[11px] text-white/40">
              {countDemoActivities(library.completed)}/{demoTaskIds.length}
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
    </ShowcaseSection>
  );
}
