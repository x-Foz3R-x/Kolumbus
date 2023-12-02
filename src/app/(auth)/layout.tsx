export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex h-screen w-screen min-w-fit flex-col items-center justify-center overflow-hidden font-gordita">{children}</main>
  );
}
