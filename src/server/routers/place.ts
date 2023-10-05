import { prisma } from "@/lib/prisma";
import { publicProcedure, router } from "../trpc";
import { PlaceSchema } from "@/types";

const place = router({
  add: publicProcedure.input(PlaceSchema).mutation(async ({ input }) => {
    const {
      types,
      addressComponents,
      photos,
      currentOpeningHours,
      openingHours,
      secondaryOpeningHours,
      editorialSummary,
      reviews,
      geometry,
      ...placeData
    } = input;

    // Prisma does not accept null values in json type, so they have been converted to undefined.
    const place = await prisma.place.create({
      data: {
        types: {
          connect: types,
        },
        addressComponents: addressComponents ?? undefined,
        photos: photos ?? undefined,
        currentOpeningHours: currentOpeningHours ?? undefined,
        openingHours: openingHours ?? undefined,
        secondaryOpeningHours: secondaryOpeningHours ?? undefined,
        editorialSummary: editorialSummary ?? undefined,
        reviews: reviews ?? undefined,
        geometry: geometry ?? undefined,
        ...placeData,
      },
    });

    return place;
  }),
});

export default place;
