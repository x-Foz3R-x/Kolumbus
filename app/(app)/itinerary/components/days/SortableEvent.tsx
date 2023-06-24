import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Event from "./Event";

interface Props {
  event: {
    id: string;
    event_cost: number;
    event_date: string;
    event_link: string;
    event_location: string;
    event_name: string;
    event_position: number;
    event_type: string;
  };
}

export default function SortableEvent({ event }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useSortable({
    id: event.id,
  });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform) }}
      {...attributes}
      {...listeners}
      className="h-[108px] w-36 flex-none list-none rounded-lg bg-white/70 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter duration-200 ease-kolumb-overflow"
    >
      <Event event={event} />
    </li>
  );
}
