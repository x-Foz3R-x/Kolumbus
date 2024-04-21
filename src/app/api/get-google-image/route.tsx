/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const imageRef = searchParams.get("imageRef");
  const width = searchParams.get("width");
  const height = searchParams.get("height");

  const maxWidth = width ? Number(width) * 4 : undefined;
  const maxHeight = height ? Number(height) * 4 : undefined;

  const getSrc = () => {
    if (maxWidth) {
      return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${imageRef}&maxwidth=${maxWidth}&key=${process.env.GOOGLE_KEY}`;
    } else if (maxHeight) {
      return `https://maps.googleapis.com/maps/api/place/photo?photo_reference=${imageRef}&maxheight=${maxHeight}&key=${process.env.GOOGLE_KEY}`;
    }
  };

  return new ImageResponse(
    <img src={getSrc()} alt="img" style={{ width: "100%", height: "100%", objectFit: "cover" }} />,
    {
      width: maxWidth,
      height: maxHeight,
    },
  );
}
