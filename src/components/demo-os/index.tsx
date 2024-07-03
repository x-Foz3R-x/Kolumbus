import MenuBar from "./menu-bar";
import Desktop from "./desktop";

export default function DemoOs() {
  return (
    <div className="rounded-t-[32px]- bg-gradient-to-br- shadow-2xl- relative flex h-fit w-full flex-col overflow-hidden rounded-3xl border-gray-700 bg-kolumblue-500/25 from-orange-200 to-green-100 font-inter shadow-2xl lg:w-[90%]">
      <MenuBar />
      <Desktop />
    </div>
  );
}
