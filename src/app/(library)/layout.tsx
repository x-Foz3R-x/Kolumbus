import { Metadata } from "next/types";

import LibraryNav from "@/components/layouts/library-nav";
import GlobalFooter from "@/components/layouts/global-footer";

export const metadata: Metadata = {
  title: "Library - Kolumbus",
  description: "Browse your personal and shared trips on Kolumbus. Explore, plan, and reminisce about your adventures.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LibraryNav />
      {children}
      <GlobalFooter />
    </>
  );
}
