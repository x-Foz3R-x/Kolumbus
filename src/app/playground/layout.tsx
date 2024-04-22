import GlobalFooter from "~/components/global-footer";

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <GlobalFooter />
    </>
  );
}
