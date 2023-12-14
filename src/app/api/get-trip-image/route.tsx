/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoRefs = searchParams.get("photoRefs")?.split(",").splice(0, 3) ?? [];

  const getSrc = (photoRef: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=896&key=${process.env.GOOGLE_KEY}`;
  };

  if (photoRefs.length === 1) {
    return new ImageResponse(
      (
        <div style={{ display: "flex" }}>
          <img src={getSrc(photoRefs[0])} alt="img" style={{ width: "448px", height: "448px", objectFit: "cover" }} />
        </div>
      ),
      { width: 448, height: 448 },
    );
  } else if (photoRefs.length === 2) {
    return new ImageResponse(
      (
        <div style={{ display: "flex" }}>
          <img
            src={getSrc(photoRefs[0])}
            alt="img1"
            style={{
              width: "448px",
              height: "448px",
              objectFit: "cover",
              clipPath: "polygon(0% 0%, 43% 0%, 57% 100%, 0% 100%)",
            }}
          />
          <img
            src={getSrc(photoRefs[1])}
            alt="img2"
            style={{
              width: "448px",
              height: "448px",
              objectFit: "cover",
              position: "absolute",
              clipPath: "polygon(43% 0%, 100% 0%, 100% 100%, 57% 100%)",
            }}
          />
          <div
            style={{
              width: "448px",
              height: "448px",
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(42.5% 0, 43.5% 0, 57.5% 100%, 56.5% 100%)",
            }}
          />
        </div>
      ),
      { width: 448, height: 448 },
    );
  } else if (photoRefs.length === 3) {
    return new ImageResponse(
      (
        <div style={{ display: "flex" }}>
          <img
            src={getSrc(photoRefs[1])}
            alt="img2"
            style={{
              width: "448px",
              height: "448px",
              objectFit: "cover",
              clipPath: "polygon(22% 0%, 64% 0%, 78% 100%, 36% 100%)",
            }}
          />
          <div
            style={{
              width: "448px",
              height: "448px",
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(22% 0, 23% 0, 37% 100%, 36% 100%)",
            }}
          />
          <img
            src={getSrc(photoRefs[0])}
            alt="img1"
            style={{
              width: "448px",
              height: "448px",
              objectFit: "cover",
              position: "absolute",
              right: "39%",
              clipPath: "polygon(39% 0%, 61% 0%, 75% 100%, 39% 100%)",
            }}
          />
          <div
            style={{
              width: "448px",
              height: "448px",
              position: "absolute",
              backgroundColor: "white",
              clipPath: "polygon(63% 0, 64% 0, 78% 100%, 77% 100%)",
            }}
          />
          <img
            src={getSrc(photoRefs[2])}
            alt="img3"
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              left: "39%",
              objectFit: "cover",
              clipPath: "polygon(25% 0%, 61% 0%, 61% 100%, 39% 100%)",
            }}
          />
        </div>
      ),
      { width: 448, height: 448 },
    );
  }

  return new Response("Invalid request", { status: 400 });
}
