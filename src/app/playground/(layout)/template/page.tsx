import Link from "next/link";

export default function Template() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center text-lg font-bold text-gray-800">
        Template
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl shadow-borderXL" />
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="h-3 w-3 cursor-default rounded-full bg-red-450" />
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="h-3 w-3 rounded-full bg-green-600" />
        </div>

        <h2 className="font-medium text-gray-800">Container</h2>
      </div>

      <main
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 flex items-center justify-center overflow-auto rounded-b-xl bg-white"
      ></main>
    </div>
  );
}
