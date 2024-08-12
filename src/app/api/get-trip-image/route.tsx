/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
import { env } from "~/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const imageRefs = searchParams.get("imageRefs")?.split(",").splice(0, 3) ?? [];
  const size = parseInt(searchParams.get("size") ?? "448");
  const pixelSize = `${size}px`;

  // Get the image from Google Maps API
  const getUrl = (imageRef: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${imageRef}&maxheight=${size * 2}&key=${env.GOOGLE_KEY}`;
  };

  // Generate the image based on the number of image references
  if (imageRefs.length === 1) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: pixelSize, height: pixelSize }}>
          <img
            src={getUrl(imageRefs[0]!)}
            alt="trip-image"
            style={{ width: pixelSize, height: pixelSize, objectFit: "cover" }}
          />
        </div>
      ),
      { width: size, height: size },
    );
  } else if (imageRefs.length === 2) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: pixelSize, height: pixelSize }}>
          <img
            src={getUrl(imageRefs[0]!)}
            alt="trip-image-1"
            style={{
              width: pixelSize,
              height: pixelSize,
              objectFit: "cover",
              clipPath: "polygon(0% 0%, 43% 0%, 57% 100%, 0% 100%)",
            }}
          />
          <img
            src={getUrl(imageRefs[1]!)}
            alt="trip-image-2"
            style={{
              width: pixelSize,
              height: pixelSize,
              objectFit: "cover",
              position: "absolute",
              clipPath: "polygon(43% 0%, 100% 0%, 100% 100%, 57% 100%)",
            }}
          />
          <div
            style={{
              width: pixelSize,
              height: pixelSize,
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(42.5% 0, 43.5% 0, 57.5% 100%, 56.5% 100%)",
            }}
          />
        </div>
      ),
      { width: size, height: size },
    );
  } else if (imageRefs.length === 3) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", width: pixelSize, height: pixelSize }}>
          <img
            src={getUrl(imageRefs[1]!)}
            alt="trip-image-2"
            style={{
              width: pixelSize,
              height: pixelSize,
              objectFit: "cover",
              clipPath: "polygon(22% 0%, 64% 0%, 78% 100%, 36% 100%)",
            }}
          />
          <div
            style={{
              width: pixelSize,
              height: pixelSize,
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(22% 0, 23% 0, 37% 100%, 36% 100%)",
            }}
          />
          <img
            src={getUrl(imageRefs[0]!)}
            alt="trip-image-1"
            style={{
              width: pixelSize,
              height: pixelSize,
              objectFit: "cover",
              position: "absolute",
              right: "39%",
              clipPath: "polygon(39% 0%, 61% 0%, 75% 100%, 39% 100%)",
            }}
          />
          <div
            style={{
              width: pixelSize,
              height: pixelSize,
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(63% 0, 64% 0, 78% 100%, 77% 100%)",
            }}
          />
          <img
            src={getUrl(imageRefs[2]!)}
            alt="trip-image-3"
            style={{
              width: pixelSize,
              height: pixelSize,
              objectFit: "cover",
              position: "absolute",
              left: "39%",
              clipPath: "polygon(25% 0%, 61% 0%, 61% 100%, 39% 100%)",
            }}
          />
        </div>
      ),
      { width: size, height: size },
    );
  }

  return new Response("Invalid request", { status: 400 });
}
