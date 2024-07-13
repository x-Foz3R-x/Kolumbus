import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

import { Link } from "~/components/ui";

export default function Footer(props: { className?: string }) {
  return (
    <footer
      className={cn(
        "grid grid-cols-1 gap-y-12 rounded-t-[3rem] bg-gray-800 px-4 pb-8 pt-24 font-inter font-medium text-white/75 md:grid-cols-8 md:gap-x-12 md:px-12 lg:gap-y-24 xl:gap-x-[10vw]",
        props.className,
      )}
    >
      <p className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent md:col-span-3">
        Kolumbus is your story hard drive. Cherish each moment and craft long-lasting memories.
        Travel thoughtfully with Kolumbus by your side.
      </p>

      <section className="flex w-full flex-wrap justify-between gap-4 gap-y-8 whitespace-nowrap md:col-span-5 lg:col-span-4 lg:col-start-5">
        {siteConfig.footerNav.map((nav, i) => (
          <ul key={i} className="flex w-fit flex-col gap-2 lg:w-auto">
            {nav.items.map((item) => (
              <Link.Default
                key={item.title}
                href={item.href}
                target={item.external ? "_blank" : "_self"}
                className="duration-250 ease-kolumb-flow hover:text-white"
              >
                {item.title}
              </Link.Default>
            ))}
          </ul>
        ))}
      </section>

      <section className="flex flex-wrap items-center justify-center gap-6 text-sm md:col-span-8 lg:justify-between">
        <div className="pointer-events-none select-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent">
          Designed by Foz3R
        </div>

        <div className="order-1 flex flex-wrap items-center justify-center gap-x-6 text-white/50 md:order-2 md:justify-start">
          <Link.Default href="/privacy" className="px-2 py-1">
            Privacy
          </Link.Default>
          <Link.Default href="/terms" className="px-2 py-1">
            Terms
          </Link.Default>
          <p>&copy; Kolumbus 2024</p>
        </div>
      </section>
    </footer>
  );
}
