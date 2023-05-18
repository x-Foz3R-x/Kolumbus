import Header from "./components/header/header";
import SidebarMenu from "./components/sidebar-menu/sidebar-menu";
import { inter } from "../fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-inter">
      <Header />
      <div className="flex text-gray-700">
        <SidebarMenu />
        {children}
      </div>
    </div>
  );
}
