"use client";

import { useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { Icons } from "~/components/ui";
import { Modal, ModalHeader } from "~/components/ui/modal";
import { cn } from "~/lib/utils";
import ColorBlock from "./color-block";
import ShowcaseSection from "./showcase-section";

const scenes = [
  {
    label: "The itinerary",
    title: "See the shape of your adventure.",
    description:
      "Days down the side, places across the page. Collect ideas, put them in order and leave room for a change of plan.",
    src: "/concept/itinerary.webp",
    alt: "Original Kolumbus itinerary with day cards and places to visit in Gdańsk",
    width: 2000,
    height: 1150,
    note: "Original app · 2023",
    color: "bg-kolumblue-100",
    icon: Icons.itinerary,
  },
  {
    label: "The little details",
    title: "A place is more than a pin.",
    description:
      "Photos, addresses and your own notes, right beside the day they belong to. An early design also explored categories and costs.",
    src: "/concept/place-details.webp",
    alt: "Early Kolumbus place card expanded over an itinerary, with category, cost, address and website fields",
    width: 1130,
    height: 1216,
    note: "Interface exploration · 2023",
    color: "bg-emerald-50",
    icon: Icons.pin,
  },
  {
    label: "The trip library",
    title: "One home for all your getaways.",
    description:
      "A weekend away or an idea for later. Each trip has its own cover, dates and a plan ready to open.",
    src: "/concept/library.webp",
    alt: "Original Kolumbus library showing three trip covers, their dates and a new trip card",
    width: 2000,
    height: 757,
    note: "Original app recording · 2024",
    color: "bg-yellow-50",
    icon: Icons.library,
  },
  {
    label: "The first sketch",
    title: "Every adventure starts somewhere.",
    description:
      "The original page of scribbles: day cards, expandable places, routes and weather, before they became an interface.",
    src: "/concept/first-sketch.webp",
    alt: "The original hand-drawn Kolumbus concept with notes in Polish about days, places, weather, routes and a timeline",
    width: 2560,
    height: 1440,
    note: "From the sketchbook",
    color: "bg-orange-50",
    icon: Icons.clipboardPin,
  },
] as const;

export default function Concept() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const scene = scenes[active] ?? scenes[0];

  function navigateTabs(event: KeyboardEvent<HTMLDivElement>) {
    let next = active;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (active + 1) % scenes.length;
    else if (["ArrowLeft", "ArrowUp"].includes(event.key))
      next = (active + scenes.length - 1) % scenes.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = scenes.length - 1;
    else return;

    event.preventDefault();
    setActive(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`#concept-tab-${next}`)?.focus();
  }

  return (
    <ShowcaseSection
      id="concept"
      tone="blue"
      side="right"
      title={
        <>
          A closer look
          <ColorBlock className="-rotate-3 bg-emerald-400 text-gray-800 selection:bg-emerald-100 selection:text-emerald-700 hover:rotate-6">
            inside
          </ColorBlock>
          the app
        </>
      }
    >
      <div className="grid gap-7 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <div className="min-w-0">
          <div
            role="tablist"
            aria-label="Explore the Kolumbus concept"
            onKeyDown={navigateTabs}
            className="flex gap-2 overflow-x-auto pb-3 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {scenes.map((item, index) => (
              <button
                key={item.label}
                id={`concept-tab-${index}`}
                role="tab"
                type="button"
                aria-selected={index === active}
                aria-controls="concept-panel"
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                className={cn(
                  "group flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl border px-4 py-3 text-left text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-800 motion-reduce:transition-none lg:py-4",
                  index === active
                    ? "border-transparent bg-emerald-400 text-gray-800 shadow-md lg:-rotate-2"
                    : "border-transparent bg-white/85 text-gray-600 hover:border-white hover:bg-white",
                )}
              >
                <span className="font-inconsolata text-xs opacity-60">0{index + 1}</span>
                <item.icon
                  aria-hidden="true"
                  className={cn("size-4", index === active ? "fill-gray-800" : "fill-gray-400")}
                />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 max-w-sm border-l-2 border-gray-800/15 pl-4 lg:mt-8">
            <h3 className="font-belanosima text-xl text-gray-800">{scene.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-800/75">{scene.description}</p>
          </div>
        </div>

        <div
          id="concept-panel"
          role="tabpanel"
          aria-labelledby={`concept-tab-${active}`}
          tabIndex={0}
          className="min-w-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-kolumblue-500"
        >
          <div className="relative mx-1 sm:mx-3">
            <div
              aria-hidden="true"
              className="absolute inset-0 translate-y-2 rotate-1 rounded-2xl border border-kolumblue-200 bg-white/70"
            />
            <motion.div
              key={scene.src}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl border border-white bg-white p-2 shadow-xl sm:p-3"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 border-x border-white/50 bg-yellow-200/80"
              />
              <button
                type="button"
                onClick={() => setExpanded(true)}
                aria-label={`Enlarge ${scene.label.toLowerCase()}`}
                aria-haspopup="dialog"
                className={cn(
                  "group relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kolumblue-500",
                  scene.color,
                )}
              >
                <Image
                  src={scene.src}
                  alt={scene.alt}
                  width={scene.width}
                  height={scene.height}
                  sizes="(min-width: 1600px) 1050px, (min-width: 1024px) 70vw, 90vw"
                  className="h-full w-full object-contain p-2 transition-transform duration-300 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none sm:p-4"
                />
                <span className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full border border-gray-200 bg-white/95 px-3 py-2 text-[11px] text-gray-600 shadow-sm transition-colors group-hover:bg-gray-800 group-hover:text-white sm:bottom-4 sm:right-4">
                  Take a closer look
                  <Icons.arrowTopRight aria-hidden="true" className="size-2.5 fill-current" />
                </span>
              </button>
              <div className="flex items-center justify-between gap-3 px-2 pb-1 pt-3 font-inconsolata text-[11px] text-gray-400">
                <span>{scene.note}</span>
                <span>
                  0{active + 1} / 0{scenes.length}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={expanded}
        setOpen={setExpanded}
        dismissible
        size="unset"
        animation={null}
        overlayClassName="bg-gray-950/80 backdrop-blur-sm"
        className="apply-custom-cursor w-[calc(100vw-1.5rem)] max-w-[1600px] border-0"
      >
        <div className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 sm:px-6">
          <div>
            <ModalHeader className="font-belanosima text-xl">{scene.label}</ModalHeader>
            <p className="mt-0.5 text-[11px] text-gray-400">{scene.note}</p>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(false)}
            aria-label="Close image"
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-kolumblue-500"
          >
            <Icons.x aria-hidden="true" className="size-3.5 fill-gray-600" />
          </button>
        </div>
        <div className={cn("flex justify-center p-2 sm:p-4", scene.color)}>
          <Image
            src={scene.src}
            alt={scene.alt}
            width={scene.width}
            height={scene.height}
            className="h-auto max-h-[calc(100dvh-12rem)] w-auto max-w-full object-contain"
          />
        </div>
        <div className="flex justify-between gap-4 px-4 py-3 text-[11px] text-gray-500 sm:px-6">
          <span>Original Kolumbus project archive</span>
          <a
            href={scene.src}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-kolumblue-600 underline underline-offset-4"
          >
            Open full size ↗
          </a>
        </div>
      </Modal>
    </ShowcaseSection>
  );
}
