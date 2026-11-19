import Brand from "~/components/brand";
import { Icons, Link } from "~/components/ui";
import { isShowcase, siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";

const exploreLinks = [
  { label: "Inside Kolumbus", href: "/#concept" },
  { label: "Try the demo", href: "/#demo" },
  { label: "Contact", href: "/contact" },
];
const elsewhere = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "Discord", href: siteConfig.links.discord },
  { label: "Instagram", href: siteConfig.links.instagram },
  { label: "YouTube", href: siteConfig.links.youtube },
  { label: "X", href: siteConfig.links.x },
];

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "rounded-t-[3rem] bg-gray-800 px-6 pb-8 pt-14 font-inter text-sm text-white/85 sm:px-10 lg:px-14",
        className,
      )}
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-wrap items-start gap-x-12 gap-y-6">
          <a
            href="/"
            aria-label="Kolumbus homepage"
            className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <Brand inverse className="text-3xl [&_svg]:size-10" />
          </a>
          <p className="max-w-xl leading-relaxed text-white/80">
            A personal travel-planning project. A place for your plans, your discoveries, and a
            little room for spontaneity.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-16 gap-y-7">
          <nav aria-label="Explore Kolumbus">
            <p className="font-inconsolata text-xs uppercase tracking-[0.15em] text-white/60">
              Explore
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-3">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="underline-offset-4 hover:underline focus-visible:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Kolumbus elsewhere">
            <p className="font-inconsolata text-xs uppercase tracking-[0.15em] text-white/60">
              Elsewhere
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-3">
              {elsewhere.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 underline-offset-4 hover:underline focus-visible:underline"
                  >
                    {link.label}
                    <Icons.arrowTopRight
                      aria-hidden="true"
                      className="size-2 fill-current opacity-60"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-12 font-medium text-white/75">
          <section className="flex flex-wrap items-center justify-center gap-6 text-sm md:col-span-8 lg:justify-between">
            <div className="pointer-events-none select-none bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent">
              Designed by Foz3R
            </div>

            <div className="order-1 flex flex-wrap items-center justify-center gap-x-6 text-white/50 md:order-2 md:justify-start">
              {!isShowcase && (
                <>
                  <Link.Default href="/privacy" className="px-2 py-1">
                    Privacy
                  </Link.Default>
                  <Link.Default href="/terms" className="px-2 py-1">
                    Terms
                  </Link.Default>
                </>
              )}
              <p>&copy; Kolumbus 2024</p>
            </div>
          </section>
        </div>
      </div>
    </footer>
  );
}
