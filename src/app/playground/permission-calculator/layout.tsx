import TopNav from "../_components/top-nav";
import Window from "../_components/window";

export const metadata = {
  title: "Permission Calculator",
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <TopNav name="Permission Calculator" />

      <div className="min-h-screen w-screen bg-gray-50">
        <Window windowName="P-Cal deluxe 5000">{props.children}</Window>
      </div>
    </>
  );
}
