import Icon from "@/components/icons";
import Divider from "@/components/ui/divider";
import Link from "next/link";

export default function Legal() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-2">
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="text-lg font-bold text-gray-600">Kolumbus Legal</h1>
      <p>Find legal information and resources</p>

      <div>
        <Link href="/legal/policy" className="px-2 text-kolumblue-600 decoration-kolumblue-500 hover:underline">
          Privacy
        </Link>

        <Divider orientation="vertical" className="mx-3 inline-block h-3 bg-gray-300" />

        <Link href="/legal/terms" className="px-2 text-kolumblue-600 decoration-kolumblue-500 hover:underline">
          Terms
        </Link>
      </div>
    </div>
  );
}
