import { AuthProvider } from "@/context/auth";

import Link from "next/link";
import Icon from "@/components/icons";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen min-w-fit flex-col items-center justify-center font-gordita">
      <Link href="/">
        <Icon.logo className="h-24" />
      </Link>
      <AuthProvider>{children}</AuthProvider>
    </main>
  );
}
