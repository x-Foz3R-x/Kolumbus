import Link from "next/link";
import { cn } from "~/lib/utils";
import Icon from "~/components/icons";
import { ButtonVariants } from "~/components/ui";
import ProfileButton from "~/components/profile-button";

export default function TopNav() {
  return (
    <nav className="sticky inset-x-0 top-0 z-50 h-16 bg-white bg-white/80 backdrop-blur-lg backdrop-saturate-[180%] backdrop-filter">
      <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between overflow-hidden px-8">
        <div className="h-16 flex-shrink-0 px-2 py-4">
          <Link href="/" title="Homepage" aria-label="Homepage">
            <Icon.logo className="m-auto h-7 fill-gray-900" />
          </Link>
        </div>

        <section className="flex h-14 flex-shrink-0 items-center justify-end gap-4 font-belanosima">
          {/* Link Group */}
          <div className="flex">
            <Link
              href="/library"
              className={cn(
                ButtonVariants({ variant: "scale", size: "lg" }),
                "flex items-center gap-2 text-lg before:bg-gray-100",
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
