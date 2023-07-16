import { AppDataProvider } from "@/context/app-data";

import Header from "@/components/layouts/header";
import SidebarMenu from "@/components/layouts/sidebar-menu";
import App from "@/components/app/itinerary/app";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden font-inter">
      <Header />
      <div className="relative flex bg-white">
        <AppDataProvider>
          <SidebarMenu />

          <div className="absolute left-[13.5rem] top-2 z-10 h-[calc(100vh-4rem)] w-2 shadow-kolumblue"></div>
          <div className="absolute -top-2 left-[14.5rem] z-40 h-2 w-[calc(100vw-14.5rem)] shadow-kolumblue"></div>

          <App>{children}</App>
        </AppDataProvider>
      </div>
    </div>
  );
}
