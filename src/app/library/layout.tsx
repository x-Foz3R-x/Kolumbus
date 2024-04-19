import TopNav from "./_components/top-nav";
import GlobalFooter from "~/components/global-footer";

export const metadata = {
  title: "Library - Kolumbus",
  description:
    "Browse your personal and shared trips, create new adventures, duplicate existing trips for easy planning, or delete trips as needed. It's your one-stop destination for trip management.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      {children}
      <GlobalFooter />
    </>
  );
}
