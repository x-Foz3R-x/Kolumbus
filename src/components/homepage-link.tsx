import Link from "next/link";
import { Icons } from "./ui";

export default function HomepageLink(props: { className?: string }) {
  return (
    <Link href="/" aria-label="Homepage" className={props.className}>
      <Icons.logoLegacy className="h-6" />
    </Link>
  );
}
