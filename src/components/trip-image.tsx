/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { tripFallbackUrl } from "~/lib/constants";

export default function TripImage({ image, size }: { image: string; size: string }) {
  // Adjust the source url to include a size parameter if the image
  // is locally generated (url starts with "/")

  const src = image.startsWith("/") ? `${image}&size=${parseInt(size) * 2}` : image;

  return image.startsWith("/") || image.startsWith(tripFallbackUrl) ? (
    // Use the Image component for local or fallback images for optimized loading
    <Image src={src} alt="Trip image" sizes={size} priority fill />
  ) : (
    // Use a standard img tag for custom images
    <img src={src} alt="Trip image" className="h-full w-full object-cover object-center" />
  );
}
