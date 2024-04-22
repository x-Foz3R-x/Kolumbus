import Link from "next/link";
import { cn } from "~/lib/utils";
import { ButtonVariants, Icon } from "~/components/ui";

export default function page() {
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center justify-center bg-white shadow-xs">
        <Link href="/" title="Homepage" aria-label="Homepage">
          <Icon.logo className="h-6" />
        </Link>
      </nav>
      <main className="mt-14 flex flex-col items-center gap-6 p-8">
        <Link href="/playground" title="Playground" aria-label="Playground">
          <Icon.playground className="h-12" />
        </Link>

        <div className="space-y-2 text-center font-belanosima">
          <h1 className="text-3xl font-semibold">Welcome to the playground!</h1>
          <p className="text-lg">
            This is a playground for testing and experimenting with the components and utilities of
            Kolumbus.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 font-medium *:flex *:h-32 *:w-44 *:items-center *:justify-center *:shadow-borderXL *:before:shadow-none *:before:hover:bg-kolumblue-300">
          <Link
            href="/playground/button"
            className={cn(ButtonVariants({ variant: "scale", size: "lg" }))}
          >
            Button
          </Link>
          <Link
            href="/playground/permission-calculator"
            className={cn(ButtonVariants({ variant: "scale", size: "lg" }))}
          >
            Permission <br /> Calculator
          </Link>
        </div>
      </main>
    </>
  );
}
