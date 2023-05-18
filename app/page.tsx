import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="font-gordita text-6xl">TESTY TAILWIND AND GORDITA</h1>
      <h1 className="text-6xl font-light">TESTY TAILWIND AND ADSOOSOSOSO</h1>
      <h1 className="font-adso text-6xl font-semibold">KOLUMBUS</h1>
      <h1 className="font-adso text-6xl font-semibold">Kolumbus</h1>
      <h2>Page</h2>
      <Link href="/itinerary" className="m2 rounded-md border p-2">
        ITINERARY
      </Link>
    </div>
  );
}
