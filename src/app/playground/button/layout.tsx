import TopNav from "../_components/top-nav";
import Window from "../_components/window";

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <>
      <TopNav name="Button" />

      <div className="min-h-screen w-screen bg-gray-50">
        <Window windowName="Button styles">{props.children}</Window>
      </div>
    </>
  );
}
