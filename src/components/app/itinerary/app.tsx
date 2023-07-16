"use client";

import { AuthProvider } from "@/context/auth";
import { usePathname } from "next/navigation";

export default function App({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider LoadingIndicator={usePathname()}>{children}</AuthProvider>
  );
}
