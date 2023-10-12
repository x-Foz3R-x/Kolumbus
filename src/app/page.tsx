import Icon from "@/components/icons";
import Divider from "@/components/ui/divider";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-yellow-50">
      <h1 className="text-4xl font-bold">UNDER CONSTRUCTION 🏗️</h1>
      <div className="flex flex-col items-center gap-12 rounded-xl bg-yellow-300 px-24 py-8 pb-12">
        <div className="flex flex-col items-center gap-4">
          <Icon.logo className="h-20" />
          <h1 className="text-2xl font-bold">Adventure awaits...</h1>
        </div>
        <div className="flex w-fit items-center justify-center overflow-hidden rounded-lg bg-black/10">
          <Link href="/sign-in" className="px-4 py-2 hover:underline">
            sign in
          </Link>
          <Divider gradient orientation="vertical" className="m-0 via-black/30" />
          <Link href="/sign-up" className="px-4 py-2 hover:underline">
            sign up
          </Link>
          <Divider gradient orientation="vertical" className="via-black/30" />
          <Link href="/library" className="px-4 py-2 hover:underline">
            library
          </Link>
        </div>
      </div>
    </div>
  );
}
