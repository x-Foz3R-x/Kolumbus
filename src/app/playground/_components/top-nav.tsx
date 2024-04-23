import Link from "next/link";
import { Icons } from "~/components/ui";

export default function TopNav(props: { name: string }) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-center bg-white shadow-xs">
      <Link href="/" title="Homepage" aria-label="Homepage" className="absolute left-5">
        <Icons.logo className="h-6" />
      </Link>

      <h1 className="text-lg font-medium">{props.name}</h1>

      <Link
        href="/playground"
        title="Playground"
        aria-label="Playground"
        className="absolute right-5"
      >
        <Icons.playground className="h-7" />
      </Link>
    </nav>
  );
}
