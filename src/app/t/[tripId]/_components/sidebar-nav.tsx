/* eslint-disable @next/next/no-img-element */
"use client";

import { sidebarNavConfig } from "~/config/sidebar-nav";

import ToolLink from "./tool-link";
import PageLink from "./page-link";
import ProfileButton from "~/components/profile-button";

export default function SidebarNav(props: { tripId: string }) {
  return (
    <nav className="fixed bottom-0 left-0 top-14 z-50 flex w-20 flex-col items-center justify-between gap-4 border-r bg-white/80 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <section className="flex flex-shrink-0 flex-col items-center gap-2 rounded-xl border-gray-200 pt-2 ">
        {sidebarNavConfig.tools.map((tool) => (
          <ToolLink key={tool.title} tripId={props.tripId} {...tool} />
        ))}
      </section>

      <section className="flex w-full flex-1 flex-shrink-0 flex-col items-center justify-end gap-2 pb-5">
        <div className="flex flex-col">
          {sidebarNavConfig.pages.map((page) => (
            <PageLink key={page.title} {...page} />
          ))}
        </div>

        <ProfileButton />
      </section>
    </nav>
  );
}
