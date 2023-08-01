import Icon from "@/components/icons";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col justify-between">
      <div className="flex flex-col items-center gap-4">
        <Icon.logo className="h-28" />
        <h1 className="text-4xl font-bold">Adventure awaits</h1>
      </div>
      <div className="flex items-end justify-end gap-1 text-xs">
        <Link href="/signin" className="hover:underline">
          signin
        </Link>
        <Link href="/signup" className="hover:underline">
          signup
        </Link>
        <Link href="/itinerary" className="hover:underline">
          itinerary
        </Link>
      </div>
    </div>
  );
}
