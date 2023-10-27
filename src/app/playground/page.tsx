import Icon from "@/components/icons";
import Link from "next/link";

interface Props {}

export default function page({}: Props) {
  return (
    <>
      <nav className="fixed left-0 right-0 top-0 z-10 flex h-14 items-center justify-center bg-white shadow-xs">
        <Link href="/" title="Home page" aria-label="Home page">
          <Icon.logo className="h-6" />
        </Link>
      </nav>
      <main className="mt-14 flex flex-col items-center gap-6 p-8">
        <Link href="/playground" title="Playground" aria-label="Playground">
          <Icon.playground className="h-12" />
        </Link>

        <div className="text-center">
          <h1 className="text-3xl font-semibold">Welcome to the playground!</h1>
          <p className="mt-2 text-lg">This is a playground for testing and experimenting with the components and utilities of Kolumbus.</p>
          <p className="mt-2 text-lg">You can use the navigation below to navigate between the different pages.</p>
        </div>

        <div className="grid grid-cols-4 gap-5">
          <Link
            href="/playground/color"
            title="Playground"
            aria-label="Playground"
            className="rounded-xl bg-gray-50 p-10 text-center shadow-borderXL duration-200 ease-kolumb-flow hover:scale-110 hover:bg-gray-100"
          >
            Color
          </Link>
          <Link
            href="/playground/popover"
            title="Playground"
            aria-label="Playground"
            className="rounded-xl bg-gray-50 p-10 text-center shadow-borderXL duration-200 ease-kolumb-flow hover:scale-110 hover:bg-gray-100"
          >
            Popover
          </Link>
          <Link
            href="/playground/popover"
            title="Playground"
            aria-label="Playground"
            className="rounded-xl bg-gray-50 p-10 text-center shadow-borderXL duration-200 ease-kolumb-flow hover:scale-110 hover:bg-gray-100"
          >
            Popover
          </Link>
          <Link
            href="/playground/popover"
            title="Playground"
            aria-label="Playground"
            className="rounded-xl bg-gray-50 p-10 text-center shadow-borderXL duration-200 ease-kolumb-flow hover:scale-110 hover:bg-gray-100"
          >
            Popover
          </Link>
        </div>
      </main>
    </>
  );
}
