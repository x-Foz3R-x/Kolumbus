"use client";

import { api } from "~/trpc/react";
import ContactDetails from "./_components/contact-details";
import DiscordWidget from "./_components/discord-widget";

export default function Contact() {
  const discordServer = api.external.discordServer.useQuery().data;

  return (
    <ContactDetails>
      <DiscordWidget data={discordServer} />
    </ContactDetails>
  );
}
