import { z } from "zod";
import { env } from "~/env";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { type DiscordServerResponse, DiscordServerResponseSchema } from "~/types";

export const externalRouter = createTRPCRouter({
  googleAutocomplete: publicProcedure
    .input(
      z.object({
        searchValue: z.string().min(1, "Input value must be at least 1 character long."),
        sessionToken: z.string(),
      }),
    )
    // .output(PlacesAutocompleteResponse)
    .mutation(async ({ input }) => {
      const { searchValue, sessionToken } = input;
      const response = (await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(searchValue)}&radius=5000&sessiontoken=${sessionToken}&key=${env.GOOGLE_KEY}`,
        )
      ).json()) as unknown;

      return response;
    }),
  googleDetails: publicProcedure
    .input(z.object({ place_id: z.string(), fields: z.string(), sessionToken: z.string() }))
    // .output(PlacesDetailsResponse)
    .mutation(async ({ input }) => {
      const { place_id, sessionToken, fields } = input;
      const response = (await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields}&sessiontoken=${sessionToken}&key=${env.GOOGLE_KEY}`,
        )
      ).json()) as unknown;

      return response;
    }),
  discordServer: publicProcedure.output(DiscordServerResponseSchema).query(async () => {
    const response = (await (
      await fetch("https://discord.com/api/guilds/1231931806396448859/widget.json")
    ).json()) as DiscordServerResponse;

    return response;
  }),
});
