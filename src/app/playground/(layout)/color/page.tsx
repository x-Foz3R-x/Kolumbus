import Icon from "@/components/icons";
import { cn } from "@/lib/utils";

export default function ColorPallette() {
  return (
    <>
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-center text-lg font-medium">
        Color
      </h1>

      <div className="mt-14 grid grid-cols-[auto,auto,auto] gap-y-5 p-8">
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
          <Color value={1000} className="bg-kolumblue-1000" />
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
          <Color value={1000} className="bg-gray-1000" />
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
          <Color value={1000} className="bg-tintedGray-1000" />
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
          <Color value={1000} className="bg-red-1000" />
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
          <Color value={1000} className="bg-yellow-1000" />
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
          <Color value={1000} className="bg-green-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
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
          <Color value={1000} className="bg-kolumblue-1000" />
        </section>
      </div>
    </>
  );
}

function Color({ value, className }: { value?: number; className?: string }) {
  return (
    <div className={cn("flex h-14 w-full items-center justify-center border-black", className)}>
      <Icon.x_bold className="h-8 fill-black" />
      <div className="mx-14 rounded-lg bg-black/30 p-1 text-white">PALLETTE {value}</div>
      <Icon.x_bold className="h-8 fill-white" />
    </div>
  );
}
