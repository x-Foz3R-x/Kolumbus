import { forwardRef, memo } from "react";
import Image from "next/image";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Event } from "@/types";

interface Props {
  event: Event;
  activeId: string | number | null;
  handleOnChange?: Function;
}

const DndEvent = memo(function Event({
  event,
  activeId,
  handleOnChange,
}: Props) {
  const id = event.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        item: event,
      },
      transition: {
        duration: 200,
        easing: "cubic-bezier(0.175, 0.885, 0.32, 1)",
      },
    });

  return (
    <li
      id={id}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "h-[6.75rem] w-36 rounded-[0.625rem] " +
        (id === activeId
          ? "z-20 border-2 border-dashed border-kolumblue-300/70 bg-kolumblue-100/70 backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter "
          : "z-10 ")
      }
    >
      {id === activeId ? null : (
        <DndEventContent
          event={event}
          handleOnChange={handleOnChange}
          {...listeners}
          {...attributes}
        />
      )}
    </li>
  );
});

interface ContentProps {
  event: Event;
  overlay?: boolean;
  handleOnChange?: Function;
}

export const DndEventContent = memo(
  forwardRef(function EventContent(
    { event, overlay, handleOnChange, ...props }: ContentProps,
    ref: any
  ) {
    return (
      <div
        className={
          "relative h-[6.75rem] w-36 flex-none origin-left rounded-[0.625rem] border-2 bg-white/80 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter " +
          (overlay ? "border-kolumblue-300" : "border-transparent")
        }
      >
        <div ref={ref} className="z-10 h-[80px] cursor-move" {...props}>
          <Image
            src={"/images/Untitled.png"}
            width={140}
            height={80}
            alt="event image"
            priority={true}
            className="h-full rounded-t-lg after:absolute after:inset-0 after:z-50 after:rounded-t-[0.625rem] after:bg-black after:shadow-kolumblueInset"
          />
        </div>
        <input
          type="text"
          value={event.name}
          onChange={(e) => {
            if (handleOnChange) handleOnChange(e, event.id, event.date);
          }}
          className="h-[28px] w-full bg-transparent px-2 text-base"
        />
      </div>
    );
  })
);

const handleOnChange = (e: any) => {};

export default DndEvent;
