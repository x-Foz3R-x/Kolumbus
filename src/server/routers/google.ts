import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { FieldsGroup, Language, PlacesAutocompleteResponse, PlacesDetailsResponse } from "@/types";

const google = router({
  autocomplete: publicProcedure
    .input(
      z.object({
        searchValue: z.string().min(3, "Input value must be at least 3 characters."),
        language: z.nativeEnum(Language),
        sessionToken: z.string().cuid2("Invalid session token"),
      })
    )
    .output(PlacesAutocompleteResponse)
    .mutation(async ({ input }) => {
      const response = await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
            input.searchValue
          )}&radius=5000&language=${input.language}&sessiontoken=${input.sessionToken}&key=${
            process.env.GOOGLE_KEY
          }`
        )
      ).json();

      return response;
    }),
  details: publicProcedure
    .input(
      z.object({
        place_id: z.string(),
        fields: z.nativeEnum(FieldsGroup),
        language: z.nativeEnum(Language),
        sessionToken: z.string().cuid2("Invalid session token"),
      })
    )
    .output(PlacesDetailsResponse)
    .mutation(async ({ input }) => {
      const response = await (
        await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${input.place_id}&fields=${input.fields}&language=${input.language}&key=${process.env.GOOGLE_KEY}&sessiontoken=${input.sessionToken}`
        )
      ).json();

      return response;
    }),
});

export default google;
