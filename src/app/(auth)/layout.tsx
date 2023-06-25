import { AuthProvider } from "@/context/auth";

import Link from "next/link";
import LogoSVG from "@/assets/kolumbus/logo.svg";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen min-w-fit flex-col items-center justify-center font-gordita">
      <Link href="/">
        <LogoSVG className="h-24" />
      </Link>
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}
