import Link from "next/link";

export default function Window(props: { windowName: string; children: React.ReactNode }) {
  return (
    <>
      <div
        style={{ insetInline: 200, top: 106, bottom: 50 }}
        className="absolute rounded-xl shadow-borderXL"
      />
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            className="h-3 w-3 cursor-default rounded-full border-[0.5px] border-red-600 bg-red-500"
          />
          <span className="h-3 w-3 rounded-full border-[0.5px] border-yellow-600 bg-yellow-500" />
          <span className="h-3 w-3 rounded-full border-[0.5px] border-green-600 bg-green-500" />
        </div>

        <h2 className="font-medium text-gray-800">{props.windowName}</h2>
      </div>
      <main
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 flex min-w-min flex-wrap items-center justify-center gap-8 overflow-auto rounded-b-xl bg-white p-5"
      >
        {props.children}
      </main>
      ;
    </>
  );
}
