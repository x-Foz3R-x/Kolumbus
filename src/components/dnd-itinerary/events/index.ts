import type { ActivityEventSchema } from "~/lib/validations/event";
import { eventFallbackUrl } from "~/lib/constants";

export { Activity } from "./activity";
export { ActivityOverlay } from "./activity-overlay";

export function getActivityImageUrl(event: ActivityEventSchema) {
  const images = event?.activity?.images;
  const imageIndex = event?.activity?.imageIndex;

  if (!images || images.length < 1) return eventFallbackUrl;

  return !!images[imageIndex]
    ? `/api/get-google-image?imageRef=${images[imageIndex]}&width=156&height=82`
    : eventFallbackUrl;
}
