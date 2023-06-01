"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

import Header from "./components/header/header";
import SidebarMenu from "./components/sidebar-menu/sidebar-menu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useAuth();
  const router = useRouter();
  if (!currentUser) router.push("/signin");

  return (
    <div className="overflow-hidden font-inter text-kolumbGray-900 ">
      <Header />
      <div className="flex bg-white">
        <SidebarMenu />
        {currentUser && children}
      </div>
    </div>
  );
}
