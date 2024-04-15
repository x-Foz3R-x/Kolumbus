import { Membership } from "@/db/schema/memberships";

export type ExtendedMembership = Membership & {
  trip: {
    name: string;
    startDate: string;
    endDate: string;
    photo: string | null;
    events: { photos: string[] | null; photoIndex: number }[];
    eventCount: number;
  };
};
