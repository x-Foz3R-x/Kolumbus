import Image from "next/image";

export default function TripImage({ image, size }: { image: string; size: string }) {
  return image.startsWith("/") || image.startsWith("https://utfs.io") ? (
    <Image src={image} alt="Trip image" sizes={size} priority fill />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt="Trip image" className="h-full w-full object-cover object-center" />
  );
}
