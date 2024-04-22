import GlobalFooter from "~/components/global-footer";
import GlobalTopNav from "~/components/global-top-nav";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <GlobalTopNav />
      {props.children}
      <GlobalFooter />
    </>
  );
}
