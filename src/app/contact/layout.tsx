import GlobalFooter from "~/components/layouts/global-footer";
import GlobalTopNav from "~/components/layouts/global-top-nav";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <GlobalTopNav />
      {props.children}
      <GlobalFooter />
    </>
  );
}
