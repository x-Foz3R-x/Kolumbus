"use client";

export default function FeaturesCard(props: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex min-w-0 flex-col gap-6">
      <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-gray-700/80 px-5 sm:h-64">
        {props.children}
      </div>
      <div className="px-1">
        <h3 className="font-belanosima text-2xl font-semibold text-white">{props.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">{props.description}</p>
      </div>
    </li>
  );
}
