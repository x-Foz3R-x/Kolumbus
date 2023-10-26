export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-red-200">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-center text-lg font-medium text-gray-800">
        Popover
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl border-gray-50 bg-green-100 shadow-borderXL" />

      <span className="pointer-events-none absolute left-52 top-14 select-none p-3 text-red-600">margin</span>
      <span className="pointer-events-none absolute left-52 top-36 select-none p-3 text-green-600">padding</span>

      {children}
    </div>
  );
}
