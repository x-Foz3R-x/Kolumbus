import Icon from "@/components/icons";
import Color from "./Color";
// import Icon from "@/assets/kolumbus/icon.svg";

export default function ColorPallette() {
  return (
    <>
      <header className="flex h-12 justify-center bg-kolumblue-200 py-1 text-white">
        <Icon.x className="fill-black" />
        <Icon.x className="fill-white" />
      </header>

      <div className="grid grid-cols-[auto,auto,auto] gap-4">
        <section>
          <div className="flex items-center justify-center p-1">kolumblue</div>
          <Color value={50} className="bg-kolumblue-50" />
          <Color value={100} className="bg-kolumblue-100" />
          <Color value={200} className="bg-kolumblue-200" />
          <Color value={300} className="bg-kolumblue-300" />
          <Color value={400} className="bg-kolumblue-400" />
          <Color value={500} className="bg-kolumblue-500" />
          <Color value={600} className="bg-kolumblue-600" />
          <Color value={700} className="bg-kolumblue-700" />
          <Color value={800} className="bg-kolumblue-800" />
          <Color value={900} className="bg-kolumblue-900" />
          <Color value={950} className="bg-kolumblue-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">kolumbrown</div>
          <Color value={50} className="bg-kolumbrown-50" />
          <Color value={100} className="bg-kolumbrown-100" />
          <Color value={200} className="bg-kolumbrown-200" />
          <Color value={300} className="bg-kolumbrown-300" />
          <Color value={400} className="bg-kolumbrown-400" />
          <Color value={500} className="bg-kolumbrown-500" />
          <Color value={600} className="bg-kolumbrown-600" />
          <Color value={700} className="bg-kolumbrown-700" />
          <Color value={800} className="bg-kolumbrown-800" />
          <Color value={900} className="bg-kolumbrown-900" />
          <Color value={950} className="bg-kolumbrown-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">gray</div>
          <Color value={50} className="bg-gray-50" />
          <Color value={100} className="bg-gray-100" />
          <Color value={200} className="bg-gray-200" />
          <Color value={300} className="bg-gray-300" />
          <Color value={400} className="bg-gray-400" />
          <Color value={500} className="bg-gray-500" />
          <Color value={600} className="bg-gray-600" />
          <Color value={700} className="bg-gray-700" />
          <Color value={800} className="bg-gray-800" />
          <Color value={900} className="bg-gray-900" />
          <Color value={950} className="bg-gray-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">tintedGray</div>
          <Color value={50} className="bg-tintedGray-50" />
          <Color value={100} className="bg-tintedGray-100" />
          <Color value={200} className="bg-tintedGray-200" />
          <Color value={300} className="bg-tintedGray-300" />
          <Color value={400} className="bg-tintedGray-400" />
          <Color value={500} className="bg-tintedGray-500" />
          <Color value={600} className="bg-tintedGray-600" />
          <Color value={700} className="bg-tintedGray-700" />
          <Color value={800} className="bg-tintedGray-800" />
          <Color value={900} className="bg-tintedGray-900" />
          <Color value={950} className="bg-tintedGray-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">red</div>
          <Color value={50} className="bg-red-50" />
          <Color value={100} className="bg-red-100" />
          <Color value={200} className="bg-red-200" />
          <Color value={300} className="bg-red-300" />
          <Color value={400} className="bg-red-400" />
          <Color value={500} className="bg-red-500" />
          <Color value={600} className="bg-red-600" />
          <Color value={700} className="bg-red-700" />
          <Color value={800} className="bg-red-800" />
          <Color value={900} className="bg-red-900" />
          <Color value={950} className="bg-red-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">yellow</div>
          <Color value={50} className="bg-yellow-50" />
          <Color value={100} className="bg-yellow-100" />
          <Color value={200} className="bg-yellow-200" />
          <Color value={300} className="bg-yellow-300" />
          <Color value={400} className="bg-yellow-400" />
          <Color value={500} className="bg-yellow-500" />
          <Color value={600} className="bg-yellow-600" />
          <Color value={700} className="bg-yellow-700" />
          <Color value={800} className="bg-yellow-800" />
          <Color value={900} className="bg-yellow-900" />
          <Color value={950} className="bg-yellow-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
        <section>
          <div className="flex items-center justify-center p-1">green</div>
          <Color value={50} className="bg-green-50" />
          <Color value={100} className="bg-green-100" />
          <Color value={200} className="bg-green-200" />
          <Color value={300} className="bg-green-300" />
          <Color value={400} className="bg-green-400" />
          <Color value={500} className="bg-green-500" />
          <Color value={600} className="bg-green-600" />
          <Color value={700} className="bg-green-700" />
          <Color value={800} className="bg-green-800" />
          <Color value={900} className="bg-green-900" />
          <Color value={950} className="bg-green-950" />
        </section>
      </div>
    </>
  );
}
