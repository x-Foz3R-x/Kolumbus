import Icon from "@/components/icons";
import Link from "next/link";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center justify-center bg-white shadow-xs">
        <Link href="/" title="Homepage" aria-label="Homepage" className="absolute left-5">
          <Icon.logo className="h-6" />
        </Link>
        <Link href="/playground" title="Playground" aria-label="Playground" className="absolute right-5">
          <Icon.playground className="h-7" />
        </Link>
      </nav>
      {children}
    </>
  );
}
