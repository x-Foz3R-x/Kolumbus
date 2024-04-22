import Link from "next/link";
import { cn } from "~/lib/utils";
import type { DiscordServerResponse } from "~/types";

import { addDotAfter, Skeleton } from "~/components/ui";
import Discord from "~/components/ui/icons/discord";

export default function DiscordWidget(props: { data?: DiscordServerResponse }) {
  const memberCount = props.data?.presence_count ?? 0;
  const onlineCount =
    props.data?.members.filter((member) => member.status === "online").length ?? 0;

  return (
    <div className="flex h-52 w-80 flex-col items-center justify-between rounded-lg bg-gray-700 p-6 shadow-2xl">
      <div className="h-8 p-1">
        <Discord className="h-6" />
      </div>

      {props.data ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-gray-100">{props.data.name}</h2>

          <div className="flex w-full justify-center text-xs font-medium text-gray-300">
            <span className={addDotAfter()}>
              {memberCount} Total {memberCount === 1 ? "Member" : "Members"}
            </span>
            <span>
              {onlineCount} {onlineCount === 1 ? "Member" : "Members"} Online
            </span>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-6 w-full rounded-full bg-gray-500" />
          <Skeleton className="mx-auto h-4 w-3/4 rounded-full bg-gray-500" />
        </div>
      )}

      <div style={{ backgroundColor: "#5865F2" }} className="w-full rounded-md">
        <Link
          href={props.data?.instant_invite ?? ""}
          target="_blank"
          className={cn(
            "block w-full py-1.5 text-center font-medium text-white duration-150 ease-kolumb-flow hover:bg-black/10",
            !props.data && "pointer-events-none opacity-50",
          )}
        >
          Join Server
        </Link>
      </div>
    </div>
  );
}
