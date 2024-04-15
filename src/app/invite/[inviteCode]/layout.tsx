import Image from "next/image";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0">
        <Image src="/images/asset.svg" alt="asset" className="object-cover object-center" fill />
      </div>
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <div className="flex w-96 flex-col items-center gap-6 rounded-xl bg-gray-800 p-8 text-gray-300 shadow-2xl">{children}</div>
      </div>
    </>
  );
}
