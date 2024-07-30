"use client";

import { Button, Icons } from "~/components/ui";
import FeaturesCard from "./feature-card";

export default function Features() {
  return (
    <div className="relative font-inter">
      <ul className="flex h-fit w-full gap-6 overflow-scroll rounded-bl-[3rem] bg-gray-800 px-16 pb-16 pt-20 text-white">
        <FeaturesCard title="Feature 1" description="Description 1" development />
        <FeaturesCard title="Feature 2" description="Description 2" />
        <FeaturesCard title="Feature 3" description="Description 3" development />
      </ul>

      <div className="flex justify-end">
        <span className="relative -z-10 size-8 bg-gray-800 before:absolute before:inset-0 before:rounded-tr-full before:bg-white" />

        <div className="flex h-24 w-fit gap-2 rounded-b-[3rem] bg-gray-800 px-10 text-white">
          <Button
            variant="unset"
            size="unset"
            className="flex size-14 items-center justify-center rounded-2xl bg-gray-700"
          >
            <Icons.chevron className="size-5 rotate-90 fill-white" />
          </Button>

          <Button
            variant="unset"
            size="unset"
            className="flex size-14 items-center justify-center rounded-2xl bg-gray-700"
          >
            <Icons.chevron className="size-5 -rotate-90 fill-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
