import { forwardRef, memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Event } from "@/types";

interface Props {
  event: Event;
  activeId: string | number | null;
}

const DndEvent = memo(function Event({ event, activeId }: Props) {
  const id = event.id;

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id,
      data: {
        item: event,
      },
    });

  return (
    <li
      id={id}
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={
        "h-[6.75rem] w-36 rounded-lg " +
        (id === activeId
          ? "border-2 border-dashed border-kolumblue-300 bg-white "
          : "")
      }
    >
      {id === activeId ? null : (
        <DndEventContent event={event} {...listeners} {...attributes} />
      )}
    </li>
  );
});

interface ContentProps {
  event: Event;
  className?: string;
}

export const DndEventContent = memo(
  forwardRef(function EventContent(
    { event, className, ...props }: ContentProps,
    ref: any
  ) {
    return (
      <div
        className={
          "relative h-[6.75rem] w-36 flex-none bg-white duration-200 ease-kolumb-overflow " +
          className
        }
      >
        <input
          type="text"
          value={event.name}
          onChange={handleOnChange}
          className="h-8 w-full bg-green-300 text-base"
        />
        <div ref={ref} className="cursor-move" {...props}>
          {event.date}
          <br />
          {event.position}
        </div>
      </div>
    );
  })
);

const handleOnChange = (e: any) => {};

export default DndEvent;
