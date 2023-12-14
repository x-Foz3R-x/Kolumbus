import Header from "@/components/layouts/header";
import GlobalFooter from "@/components/layouts/global-footer";
import { Divider } from "@/components/ui";

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Divider className="bg-transparent p-7" />
      {children}
      <GlobalFooter />
    </>
  );
}
