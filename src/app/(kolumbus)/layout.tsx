import { AppdataProvider } from "@/context/appdata";

import Header from "@/components/layouts/header";
import UnsupportedWidth from "@/components/layouts/unsupportedWidth";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppdataProvider>
      {/* <div className="supported-width bg-white font-inter"> */}
      <div className="bg-white font-inter">
        <Header />
        {children}
      </div>
      {/* <UnsupportedWidth /> */}
    </AppdataProvider>
  );
}
