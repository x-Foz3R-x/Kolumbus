"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/context/auth";

export default function App({ children }: { children: React.ReactNode }) {
  return <AuthProvider LoadingIndicator={usePathname()}>{children}</AuthProvider>;
}
