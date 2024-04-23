import GlobalFooter from "~/components/layouts/global-footer";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalFooter />
    </>
  );
}
