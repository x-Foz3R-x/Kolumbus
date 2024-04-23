"use client";

import Link from "next/link";
import { Button, Icons } from "~/components/ui";
import { api } from "~/trpc/react";
import DiscordWidget from "./_components/discord-widget";

export default function Contact() {
  const discordServer = api.external.discordServer.useQuery().data;
  const email = "pawel@kolumbus.app";

  const copyEmailToClipboard = () => navigator.clipboard.writeText(email);

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-wrap items-center justify-center gap-10 p-10">
      <div className="space-y-2">
        <h1 className="text-lg font-bold">Get in Touch</h1>
        <p>
          Have a question, suggestion, or found a bug? <br />
          Maybe you just want to say hi? <br />
          Don’t hesitate to reach out!
        </p>
      </div>

      <div className="space-y-4">
        <DiscordWidget data={discordServer} />

        <div className="flex w-80 flex-col items-center justify-center rounded-lg bg-gray-700 p-6 shadow-2xl">
          <div>
            <h2 className="w-full font-bold text-gray-100">Drop me an Email</h2>
            <p className="w-full text-xs text-gray-300">I’ll respond as soon as I can</p>
            <div className="mt-1 flex w-full items-center gap-4 font-medium">
              <Link href={`mailto:${email}`} className="text-blue-400 hover:underline">
                {email}
              </Link>

              <Button
                onClick={copyEmailToClipboard}
                variant="scale"
                size="icon"
                className="p-2.5 before:bg-gray-600 active:scale-95"
              >
                <Icons.copy className="h-4 w-4 scale-100 fill-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
