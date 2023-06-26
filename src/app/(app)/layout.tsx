import { UserDataProvider } from "@/context/user-data";
import { AuthProvider } from "@/context/auth";

import Header from "@/components/layouts/header";
import SidebarMenu from "@/components/layouts/sidebar-menu";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden font-inter ">
      <Header />
      <div className="flex bg-white">
        <UserDataProvider>
          <SidebarMenu />
          <AuthProvider LoadingIndicator="itinerary">{children}</AuthProvider>
        </UserDataProvider>
      </div>
    </div>
  );
}
