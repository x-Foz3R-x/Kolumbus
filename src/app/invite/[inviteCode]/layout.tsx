import TravelersBackground from "~/components/artwork/travelers-background";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TravelersBackground />

      <div className="absolute inset-0 flex size-full min-h-[32rem] items-center justify-center p-4">
        <div className="flex w-96 flex-col items-center gap-6 rounded-xl bg-gray-700 p-8 text-gray-300 shadow-2xl ">
          {children}
        </div>
      </div>
    </>
  );
}
