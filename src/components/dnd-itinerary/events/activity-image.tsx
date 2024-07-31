import Image from "next/image";

import { eventFallbackUrl } from "~/lib/constants";
import type { PlaceSchema } from "~/lib/types";

export default function ActivityImage(props: { event: PlaceSchema; size?: number }) {
  const imageUrl = getActivityImageUrl(props.event);

  if (imageUrl.startsWith("/") || imageUrl.startsWith(eventFallbackUrl)) {
    return (
      <Image
        src={imageUrl}
        alt="Event Image"
        className="select-none object-cover object-center"
        sizes={props?.size ? `${props.size * 4}px` : undefined}
        priority
        fill
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="Event Image" className="select-none object-cover object-center" />
  );
}

function getActivityImageUrl(event: PlaceSchema) {
  const imageUrl = event?.imageUrl;

  if (!imageUrl) return eventFallbackUrl;
  if (imageUrl?.startsWith("http")) return imageUrl;

  if (imageUrl.startsWith("ref:")) {
    return `/api/get-google-image?imageRef=${imageUrl.split("ref:")[1]}&width=156&height=82`;
  }

  return eventFallbackUrl;
}
