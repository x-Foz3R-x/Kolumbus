"use client";

import { useState } from "react";

import Window from "~/components/window";
import DemoLibrary from "./demo/demo-library";
import DemoTasks from "./demo/demo-tasks";
import DemoTripEditor from "./demo/demo-trip";
import useDemoLibrary from "./demo/use-demo-library";

export default function Demo() {
  const library = useDemoLibrary();
  const [selectedId, setSelectedId] = useState<string | null>();
  const activeId = selectedId === undefined ? library.initialTripId : selectedId;
  const activeTrip = library.trips.find((trip) => trip.id === activeId);

  const openLibrary = () => {
    setSelectedId(null);
    library.complete("library");
  };

  return (
    <section
      className="mx-auto max-w-[1440px] scroll-mt-20 px-0 pb-24 pt-16 font-inter sm:px-4 sm:pb-32 sm:pt-24"
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

      <div
        id="demo"
        className="grid scroll-mt-20 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_288px]"
      >
        <Window
          title="Kolumbus"
          isOpen
          containerClassName="w-full min-w-0"
          className="flex min-h-[540px] w-full flex-col p-0"
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
              onCreate={(template) => setSelectedId(library.create(template))}
              onDuplicate={library.duplicate}
              onDelete={library.remove}
            />
          )}
          <div className="mt-auto flex min-h-12 items-center justify-between gap-2 border-t border-gray-100 bg-white px-4 text-[11px] text-gray-400 sm:px-6">
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
        <Window
          title="Things to try"
          isOpen
          containerClassName="w-full min-w-0"
          className="w-full p-0 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto"
        >
          <DemoTasks completed={library.completed} />
        </Window>
      </div>
    </section>
  );
}
