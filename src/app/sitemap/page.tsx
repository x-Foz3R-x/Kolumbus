import Icon from "@/components/icons";
import Link from "next/link";

export default function page() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="text-lg font-bold text-gray-600">Site Map</h1>
      <p>Work in progress</p>
    </div>
  );
}
