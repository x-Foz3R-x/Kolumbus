import Image from "next/image";

interface Props {
  number: number;
}

export default function Day({ number }: Props) {
  return (
    <li className="h-24 w-36 flex-none rounded-lg bg-white/70 shadow-kolumblue backdrop-blur-[20px] backdrop-saturate-[180%] backdrop-filter">
      <header className="relative h-5 w-full rounded-t-lg bg-kolumblue-500">
        <input
          type="text"
          placeholder="Enter location"
          className="absolute inset-0 rounded-t-lg bg-transparent px-2 text-xs font-medium text-white/75 placeholder:font-light placeholder:text-white/50"
        />
      </header>
      <div className="event-body flex h-fit w-full select-none gap-2 p-2">
        <Image
          src={"/images/Untitled.png"}
          height={1}
          width={108}
          className="h-fit rounded-md bg-contain bg-center object-contain object-center shadow-default"
          alt="default event image"
        />
        <div className="flex flex-col justify-center overflow-hidden">
          Day {number}
        </div>
      </div>
    </li>
  );
}
