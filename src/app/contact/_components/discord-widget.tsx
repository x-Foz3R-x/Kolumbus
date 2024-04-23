import Link from "next/link";
import { cn } from "~/lib/utils";
import type { DiscordServerResponse } from "~/types";

import { dotDivider, Skeleton } from "~/components/ui";
import Discord from "~/components/ui/icons/discord";

export default function DiscordWidget(props: { data?: DiscordServerResponse }) {
  const memberCount = props.data?.approximate_member_count ?? 0;
  const onlineCount = props.data?.approximate_presence_count ?? 0;

  return (
    <div className="flex h-52 w-80 flex-col items-center justify-between rounded-lg bg-gray-700 p-6 shadow-2xl">
      <div className="h-8 p-1">
        <Discord className="h-6" />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-bold text-gray-100">Kolumbus | Official Community</h2>

        {props.data ? (
          <div className="flex w-full justify-center text-xs font-medium text-gray-300">
            <span className={dotDivider()}>
              {memberCount} Total {memberCount === 1 ? "Member" : "Members"}
            </span>
            <span>
              {onlineCount} {onlineCount === 1 ? "Member" : "Members"} Online
            </span>
          </div>
        ) : (
          <Skeleton className="mx-auto h-4 w-4/5 rounded-full bg-gray-500" />
        )}
      </div>

      <div style={{ backgroundColor: "#5865F2" }} className="w-full rounded-md">
        <Link
          href="https://discord.com/invite/UH5BP8Hy8z"
          target="_blank"
          className={cn(
            "block w-full py-1.5 text-center font-medium text-white duration-150 ease-kolumb-flow hover:bg-black/10",
          )}
        >
          Join Server
        </Link>
      </div>
    </div>
  );
}
