import Image from "next/image";

interface Props {
  event: {
    event_cost: number;
    event_date: string;
    event_id: string;
    event_link: string;
    event_location: string;
    event_name: string;
    event_position: number;
    event_type: string;
  };
}

export default function Event({ event }: Props) {
  return (
    <li className="h-[108px] w-36 flex-none list-none rounded-lg bg-white/70 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      <header className="relative h-8 w-full rounded-t-lg border-b">
        <input
          type="text"
          placeholder="Enter location"
          className="absolute inset-0 rounded-t-lg bg-transparent px-2 text-sm font-medium placeholder:font-light placeholder:text-black/50"
        />
      </header>
      <div className="event-body flex h-fit w-full select-none gap-2 p-2">
        {/* <Image
          src={"/images/Untitled.png"}
          height={1}
          width={108}
          className="h-fit rounded-md bg-contain bg-center object-contain object-center shadow-default"
          alt="default event image"
        /> */}
        <div className="flex flex-col justify-center overflow-hidden">
          {event?.["event_name"]}
        </div>
      </div>
    </li>
  );
}
