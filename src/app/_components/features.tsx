"use client";

export default function Features() {
  return (
    <div className="relative font-inter">
      <div className="h-fit w-full rounded-bl-[3rem] bg-gray-800 px-4 py-24 text-white">
        Features cards carousel
      </div>

      <div className="flex justify-end">
        <span className="relative -z-10 size-12 bg-gray-800 before:absolute before:inset-0 before:rounded-tr-full before:bg-white" />

        <div className="h-28 w-fit rounded-b-[3rem] bg-gray-800 px-4 pt-6 text-white">
          Arrows
          {"<-- / -->"}
        </div>
      </div>
    </div>
  );
}
