"use client";

import { AuthProvider } from "@/context/auth";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function App({ children }: Props) {
  return (
    <AuthProvider LoadingIndicator={usePathname()}>{children}</AuthProvider>
  );
}
