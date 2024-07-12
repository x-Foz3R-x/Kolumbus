import Image from "next/image";
import { Link } from "~/components/ui";
import { siteConfig } from "~/config/site";

export default function Footer() {
  return (
    <footer className="flex w-full justify-evenly whitespace-nowrap bg-kolumblue-500 fill-white py-24 text-white">
      <div className="flex flex-col items-center gap-2">
        {/* Avatar */}
        <div className="relative size-d32 rounded-full bg-kolumblue-300">
          <Image
            src="https://utfs.io/f/280ffed7-2ffb-4b3d-aef2-5efe88252553-n1k92z.png"
            alt="Foz3R Avatar"
            fill
          />
        </div>

        <p className="text-2xl font-bold">Made by Foz3R</p>
        <p className="whitespace-nowrap pt-2 text-center text-kolumblue-300">
          Copyright &copy; 2024 Kolumbus. All rights reserved.
        </p>
      </div>

      <div className="flex w-3/5 justify-around">
        {siteConfig.footerNav.map((item) => (
          <div key={item.title}>
            <h3 className="pb-4 text-lg font-semibold capitalize text-kolumblue-300">
              {item.title}
            </h3>
            <ul className="flex flex-col gap-3 text-lg leading-none">
              {item.items.map((item) => (
                <Link.UnderLine
                  key={item.title}
                  href={item.href}
                  target={item.external ? "_blank" : "_self"}
                  className="text-white before:inset-x-0 before:hover:bottom-0"
                >
                  {item.title}
                </Link.UnderLine>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}
