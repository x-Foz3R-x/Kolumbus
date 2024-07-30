"use client";

import { Icons } from "~/components/ui";

export default function FeaturesCard(props: {
  title: string;
  description: string;
  development?: boolean;
}) {
  return (
    <li className="flex w-[24vw] flex-col gap-4">
      <div className="relative flex size-full h-[32vw] items-center justify-center rounded-3xl bg-gray-700">
        Image Placeholder
        {props.development && (
          <div className="absolute right-0 top-0 rounded-bl-3xl bg-gray-800 pb-4 pl-4 text-sm text-gray-400">
            <Icons.insetRadius className="absolute -left-6 top-0 size-6 rotate-90 fill-gray-800" />
            <Icons.insetRadius className="absolute -bottom-6 right-0 size-6 rotate-90 fill-gray-800" />

            <div className="whitespace-nowrap rounded-full bg-gray-700 px-2 py-1 text-yellow-600">
              In Development
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="text-d-3xl">{props.title}</h3>
        <p className="text-gray-500">{props.description}</p>
      </div>
    </li>
  );
}
