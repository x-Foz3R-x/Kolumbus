import Logo from "./logo";
import TopNavMenu from "./top-nav-menu";
import SlideAnimation from "./slide-animation";
import { Link } from "~/components/ui";
import { startLink } from "~/config/site";

export default function TopNav({
  actions,
  menu,
}: {
  actions?: React.ReactNode;
  menu?: React.ReactNode;
}) {
  return (
    <nav className="apply-custom-cursor fixed inset-x-0 top-0 z-50 flex h-16 items-center whitespace-nowrap font-belanosima">
      <Logo />

      {/* Unraveled menu */}
      <SlideAnimation
        direction="out"
        threshold={100}
        className="relative hidden h-16 w-full items-center justify-end gap-6 bg-gradient-to-b from-white via-white to-gray-100/0 px-8 pl-[224px] md:flex"
      >
        <div className="flex items-center gap-4">
          <div className="flex">
            <Link.UnderLine
              href="/#concept"
              className="fill-gray-600 px-5 text-[17px] text-gray-600 before:inset-x-5"
            >
              About
            </Link.UnderLine>
            <Link.UnderLine
              href="/contact"
              className="fill-gray-600 px-5 text-[17px] text-gray-600 before:inset-x-5"
            >
              Contact
            </Link.UnderLine>
          </div>

          {actions ?? (
            <Link.Arrow href={startLink.href} variant="primary" size="lg" className="font-semibold">
              {startLink.label}
            </Link.Arrow>
          )}
        </div>
      </SlideAnimation>

      <TopNavMenu>{menu}</TopNavMenu>
    </nav>
  );
}
