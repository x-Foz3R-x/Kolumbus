import { AppDataProvider } from "@/context/app-data";

import Header from "@/components/layouts/header";
import SidebarMenu from "@/components/layouts/sidebar-menu";
import App from "@/components/app/itinerary/app";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden font-inter">
      <Header />
      <div className="relative flex bg-white">
        <AppDataProvider>
          <SidebarMenu />

          <div className="pointer-events-none absolute left-[14rem] top-0 z-30 h-full w-full rounded-tl-lg shadow-kolumblueInset"></div>

          <App>{children}</App>
        </AppDataProvider>
      </div>
    </div>
  );
}
