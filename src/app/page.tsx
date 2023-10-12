import Icon from "@/components/icons";
import Divider from "@/components/ui/divider";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Under construction 🏗️</h1>
      <div className="flex flex-col gap-4 rounded-xl bg-yellow-300 p-8">
        <div className="flex flex-col items-center gap-4">
          <Icon.logo className="h-20" />
          <h1 className="text-2xl font-bold">Adventure awaits...</h1>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Link href="/sign-in" className="hover:underline">
            sign in
          </Link>
          <Divider orientation="vertical" />
          <Link href="/sign-up" className="hover:underline">
            sign up
          </Link>
          <Divider orientation="vertical" />
          <Link href="/library" className="hover:underline">
            library
          </Link>
        </div>
      </div>
    </div>
  );
}
