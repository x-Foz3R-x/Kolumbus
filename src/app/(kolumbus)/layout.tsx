import { AppdataProvider } from "@/context/appdata";

import Header from "@/components/layouts/header";
import UnsupportedWidth from "@/components/layouts/unsupportedWidth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="supported-width overflow-hidden font-inter">
        <AppdataProvider>
          <Header />
          {children}
        </AppdataProvider>
      </div>
      <UnsupportedWidth />
    </>
  );
}
