import Link from "next/link";
import Divider from "../ui/divider";

export default function GlobalFooter() {
  return (
    <footer className="container mx-auto flex  gap-8 px-2.5 py-8">
      <p className="text-sm text-gray-700">Copyright &copy; 2023 Kolumbus. All rights reserved.</p>
      <span className="flex">
        <Link href="/legal/privacy" className="px-3 text-sm text-gray-700 hover:underline">
          Privacy
        </Link>

        <Divider orientation="vertical" className="my-auto h-4 bg-gray-300" />

        <Link href="/legal/terms" className="px-3 text-sm text-gray-700 hover:underline">
          Terms
        </Link>

        <Divider orientation="vertical" className="my-auto h-4 bg-gray-300" />

        <Link href="/legal" className="px-3 text-sm text-gray-700 hover:underline">
          Legal
        </Link>

        <Divider orientation="vertical" className="my-auto h-4 bg-gray-300" />

        <Link href="/sitemap" className="px-3 text-sm text-gray-700 hover:underline">
          Site Map
        </Link>
      </span>
    </footer>
  );
}
