import Image from "next/image";

import { eventFallbackUrl } from "~/lib/constants";
import type { ActivityEventSchema } from "~/lib/types";

export default function ActivityImage(props: { event: ActivityEventSchema; size?: number }) {
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

function getActivityImageUrl(event: ActivityEventSchema) {
  const images = event?.activity?.images;
  const imageIndex = event?.activity?.imageIndex;

  if (!images || images.length < 1) return eventFallbackUrl;

  if (images[imageIndex]?.startsWith("http")) return images[imageIndex];

  return !!images[imageIndex]
    ? `/api/get-google-image?imageRef=${images[imageIndex]}&width=156&height=82`
    : eventFallbackUrl;
}
