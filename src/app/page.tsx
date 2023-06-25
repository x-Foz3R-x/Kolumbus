import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h2>HOME PAGE</h2>
      <Link href="/signin" className="m2 rounded-md border p-2">
        signin
      </Link>
      <Link href="/signup" className="m2 rounded-md border p-2">
        signup
      </Link>
      <Link href="/start" className="m2 rounded-md border p-2">
        start
      </Link>
      <Link href="/itinerary" className="m2 rounded-md border p-2">
        itinerary
      </Link>
      <Link href="/structure" className="m2 rounded-md border p-2">
        structure
      </Link>
    </div>
  );
}
