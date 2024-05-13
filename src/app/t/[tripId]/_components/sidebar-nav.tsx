/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { sidebarNavConfig } from "~/config/sidebar-nav";

import ToolLink from "./tool-link";
import ProfileButton from "~/components/profile-button";
import { Button, Icons } from "~/components/ui";
import PageLink from "./page-link";

export default function SidebarNav(props: { tripId: string; tool: number }) {
  return (
    <nav className="fixed bottom-0 left-0 top-14 z-50 flex w-20 flex-col items-center justify-between gap-4 border-r bg-white/80 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <section className="flex flex-shrink-0 flex-col items-center gap-2 rounded-xl border-gray-200 pt-2 ">
        {sidebarNavConfig.tools.map((tool, index) => (
          <ToolLink
            key={tool.title}
            active={index === props.tool}
            tripId={props.tripId}
            {...tool}
          />
        ))}
      </section>

      <section className="flex w-full flex-1 flex-shrink-0 flex-col items-center justify-end gap-2 pb-5">
        <div className="flex flex-col">
          {sidebarNavConfig.pages.map((tool, index) => (
            <PageLink
              key={tool.title}
              active={index === props.tool}
              tripId={props.tripId}
              {...tool}
            />
          ))}
        </div>

        <ProfileButton />
      </section>
    </nav>
  );
}
