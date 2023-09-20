import { AppdataProvider } from "@/context/appdata";

import Header from "@/components/layouts/header";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden font-inter">
      <AppdataProvider>
        <Header />
        {children}
      </AppdataProvider>
    </div>
  );
}
