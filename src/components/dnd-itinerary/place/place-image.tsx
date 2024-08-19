import Image from "next/image";

import { placeFallbackImageUrl } from "~/lib/constants";

export default function PlaceImage(props: { src?: string | null; size?: number }) {
  const imageUrl = resolveImageUrl(props.src);

  if (imageUrl.startsWith("/") || imageUrl.startsWith(placeFallbackImageUrl)) {
    return (
      <Image
        src={imageUrl}
        alt="Place Image"
        className="select-none object-cover object-center"
        sizes={props?.size ? `${props.size * 4}px` : undefined}
        priority
        fill
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="Place Image" className="select-none object-cover object-center" />
  );
}

function resolveImageUrl(imageUrl?: string | null) {
  if (!imageUrl || imageUrl.startsWith(placeFallbackImageUrl)) return placeFallbackImageUrl;
  if (imageUrl.startsWith("http")) return imageUrl;
  if (imageUrl.startsWith("ref:")) {
    return `/api/get-google-image?imageRef=${imageUrl.split("ref:")[1]}&width=156&height=82`;
  }

  return placeFallbackImageUrl;
}
