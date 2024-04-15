import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { LANGUAGES, PlacesAutocompleteResponse, PlacesDetailsResponse } from "@/types";

const google = router({
  autocomplete: publicProcedure
    .input(
      z.object({
        searchValue: z.string().min(1, "Input value must be at least 1 character long."),
        language: z.nativeEnum(LANGUAGES),
        sessionToken: z.string().cuid2("Invalid session token"),
      }),
    )
    .output(PlacesAutocompleteResponse)
    .mutation(async ({ input }) => {
      const response = await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input.searchValue)}&radius=5000&sessiontoken=${input.sessionToken}&key=${process.env.GOOGLE_KEY}`,
          // with custom language
          // )}&radius=5000&language=${input.language}&sessiontoken=${input.sessionToken}&key=${process.env.GOOGLE_KEY}`,
        )
      ).json();

      return response;
    }),
  details: publicProcedure
    .input(
      z.object({
        place_id: z.string(),
        fields: z.string(),
        language: z.nativeEnum(LANGUAGES),
        sessionToken: z.string().cuid2("Invalid session token"),
      }),
    )
    .output(PlacesDetailsResponse)
    .mutation(async ({ input }) => {
      const response = await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${input.place_id}&fields=${input.fields}&sessiontoken=${input.sessionToken}&key=${process.env.GOOGLE_KEY}`,
          // with custom language
          // `https://maps.googleapis.com/maps/api/place/details/json?place_id=${input.place_id}&fields=${input.fields}&language=${input.language}&sessiontoken=${input.sessionToken}&key=${process.env.GOOGLE_KEY}`,
        )
      ).json();

      return response;
    }),
});

export default google;
