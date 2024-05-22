import type { ActivityEvent } from "~/lib/validations/event";
import { eventFallbackUrl } from "~/lib/constants";

export { Activity } from "./activity";
export { ActivityOverlay } from "./activity-overlay";

export function getActivityImageUrl(event: ActivityEvent) {
  const images = event?.activity?.images;
  const imageIndex = event?.activity?.imageIndex;

  if (!images) return eventFallbackUrl;

  return images[imageIndex]
    ? `/api/get-google-image?imageRef=${images[imageIndex]}&width=156&height=82`
    : eventFallbackUrl;
}
