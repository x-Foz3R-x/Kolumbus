/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const photoRef = searchParams.get("photoRef");
  const width = Number(searchParams.get("width")) * 2;
  const height = Number(searchParams.get("height")) * 2;

  const getSrc = () => {
    const maxWidth = width ? Number(width) * 2 : undefined;
    const maxHeight = height ? Number(height) * 2 : undefined;

    if (maxWidth) {
      return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxwidth=${maxWidth}&key=${process.env.GOOGLE_KEY}`;
    } else if (maxHeight) {
      return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${photoRef}&maxheight=${maxHeight}&key=${process.env.GOOGLE_KEY}`;
    }
  };

  return new ImageResponse(<img src={getSrc()} alt="img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />, {
    width,
    height,
  });
}
