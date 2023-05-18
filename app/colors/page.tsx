import Color from "./color";
import Icon from "@/assets/logo/icon.svg";

export default function ColorPallette() {
  return (
    <>
      <header className="flex h-12 justify-center bg-kolumblue-50 py-1 text-white">
        <Icon className="fill-black" />
        <Icon className="fill-white" />
      </header>

      <div className="grid grid-cols-[auto,auto,auto] gap-4">
        <span>
          <Color color="kolumblue" />
        </span>
        <span>
          <Color color="gray" />
        </span>
        <span>
          <Color color="tintedGray" />
        </span>
      </div>
    </>
  );
}
