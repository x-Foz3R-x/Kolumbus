import Link from "next/link";
import { Divider } from "../ui";

export default function GlobalFooter() {
  return (
    <footer className="container mx-auto flex flex-col gap-1 px-2.5 py-8 sm:flex-row sm:gap-8">
      <p className="whitespace-nowrap text-sm text-gray-700">Copyright &copy; 2024 Kolumbus. All rights reserved.</p>
      <span className="flex whitespace-nowrap">
        <Link href="/legal/privacy" className="pr-3 text-sm text-gray-700 hover:underline">
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

        <Link href="/sitemap" className="pl-3 text-sm text-gray-700 hover:underline">
          Site Map
        </Link>
      </span>
    </footer>
  );
}
