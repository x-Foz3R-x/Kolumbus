import MenuBar from "./menu-bar";
import Desktop from "./desktop";

export default function DemoOs() {
  return (
    <div className="shadow-xxl relative flex h-fit w-full max-w-screen-xl flex-col overflow-hidden rounded-3xl border-gray-700 bg-kolumblue-500/25 font-inter lg:w-[90%]">
      <MenuBar />
      <Desktop />
    </div>
  );
}
