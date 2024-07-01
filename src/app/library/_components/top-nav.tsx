import Link from "next/link";
import { cn } from "~/lib/utils";
import { ButtonVariants, Icons } from "~/components/ui";
import ProfileButton from "~/components/profile-button";

export default function TopNav() {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-14 bg-white bg-white/80 font-belanosima backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between overflow-hidden px-8">
        <Link href="/" title="Homepage" aria-label="Homepage">
          <Icons.logoLegacy className="m-auto h-6 fill-gray-800" />
        </Link>

        <section className="flex h-14 flex-shrink-0 items-center justify-end gap-4">
          <div className="flex">
            <Link
              href="/library"
              className={cn(
                ButtonVariants({ variant: "scale", size: "lg" }),
                "flex items-center gap-2 before:bg-gray-100",
              )}
            >
              Library
            </Link>
          </div>

          <ProfileButton />
        </section>
      </div>
    </nav>
  );
}
