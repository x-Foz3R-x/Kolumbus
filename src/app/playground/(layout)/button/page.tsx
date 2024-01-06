import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ButtonTests() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-center text-lg font-medium">
        Button
      </h1>

      <div style={{ insetInline: 200, top: 106, bottom: 50 }} className="absolute rounded-xl shadow-borderXL" />
      <div
        style={{ insetInline: 200, top: 106 }}
        className="absolute flex h-11 items-center justify-center rounded-t-xl border-b border-gray-100 bg-gray-50"
      >
        <div className="absolute left-4 flex gap-2">
          <Link href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" className="h-3 w-3 cursor-default rounded-full bg-red-450" />
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="h-3 w-3 rounded-full bg-green-600" />
        </div>

        <h2 className="font-medium text-gray-800">Button variants</h2>
      </div>

      <main
        style={{ insetInline: 200, top: 150, bottom: 50 }}
        className="absolute z-20 flex min-w-min items-center justify-center overflow-auto rounded-b-xl bg-white"
      >
        <div className="grid grid-cols-2 gap-3 font-medium text-gray-600">
          <h1 className="w-full rounded-xl text-center font-medium text-gray-400">Default</h1>
          <h1 className="w-full rounded-xl text-center font-medium text-gray-400">Scale</h1>

          {/* Default */}
          <div className="flex min-w-min flex-col gap-2.5 rounded-xl bg-gray-50 p-4 px-6 shadow-insetSm">
            <div className="flex items-center justify-center gap-4">
              <Button variant="default" size="lg" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }}>
                Large
              </Button>
              <Button variant="default" size="default" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }}>
                Default
              </Button>
              <Button variant="default" size="sm" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.98 }}>
                Small
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="default"
                size="lg"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gray-500 text-gray-100"
              >
                Large
              </Button>
              <Button
                variant="default"
                size="default"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="bg-kolumblue-500 text-gray-100"
              >
                Default
              </Button>
              <Button
                variant="default"
                size="sm"
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.98 }}
                className="bg-red-500 text-gray-100"
              >
                Small
              </Button>
            </div>
          </div>

          {/* Scale */}
          <div className="flex min-w-min flex-col gap-2.5 rounded-xl bg-gray-50 p-4 shadow-insetSm">
            <div className="flex items-center justify-center gap-4">
              <Button variant="scale" size="lg" className="before:bg-gray-100" animatePress>
                Large
              </Button>
              <Button variant="scale" size="default" className="before:bg-gray-100" animatePress>
                Default
              </Button>
              <Button variant="scale" size="sm" className="before:bg-gray-100" animatePress>
                Small
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="scale" size="lg" className="before:bg-gray-500 hover:text-gray-100 focus-visible:text-gray-100" animatePress>
                Large
              </Button>
              <Button
                variant="scale"
                size="default"
                className="before:bg-kolumblue-500 hover:text-gray-100 focus-visible:text-gray-100"
                animatePress
              >
                Default
              </Button>
              <Button variant="scale" size="sm" className="before:bg-red-500 hover:text-gray-100 focus-visible:text-gray-100" animatePress>
                Small
              </Button>
            </div>
          </div>

          <h1 className="w-full rounded-xl text-center font-medium text-gray-400">Button</h1>
          <h1 className="w-full rounded-xl text-center font-medium text-gray-400">Appear</h1>

          {/* Button */}
          <div className="flex min-w-min flex-col gap-2.5 rounded-xl bg-gray-50 p-4 shadow-insetSm">
            <div className="flex items-center justify-center gap-4">
              <span className="h-11">
                <Button variant="button" size="lg" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}>
                  Large
                </Button>
              </span>
              <Button variant="button" size="default" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}>
                Default
              </Button>
              <Button variant="button" size="sm" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}>
                Small
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <span className="h-11">
                <Button
                  variant="button"
                  size="lg"
                  whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
                  className="border-gray-600 bg-gray-500 text-gray-100"
                >
                  Large
                </Button>
              </span>
              <Button
                variant="button"
                size="default"
                whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
                className="border-kolumblue-600 bg-kolumblue-500 text-gray-100"
              >
                Default
              </Button>
              <Button
                variant="button"
                size="sm"
                whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
                className="border-red-600 bg-red-500 text-gray-100"
              >
                Small
              </Button>
            </div>
          </div>

          {/* Appear */}
          <div className="flex min-w-min flex-col gap-2.5 rounded-xl bg-gray-50 p-4 shadow-insetSm">
            <div className="flex items-center justify-center gap-4">
              <Button variant="appear" size="lg" className="hover:bg-gray-100 hover:shadow-button" animatePress>
                Large
              </Button>
              <Button variant="appear" size="default" className="hover:bg-gray-100 hover:shadow-button" animatePress>
                Default
              </Button>
              <Button variant="appear" size="sm" className="hover:bg-gray-100 hover:shadow-button" animatePress>
                Small
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="appear" size="lg" className="hover:bg-gray-500 hover:text-gray-100 hover:shadow-button" animatePress>
                Large
              </Button>
              <Button
                variant="appear"
                size="default"
                className="hover:bg-kolumblue-500 hover:text-gray-100 hover:shadow-button"
                animatePress
              >
                Default
              </Button>
              <Button variant="appear" size="sm" className="hover:bg-red-500 hover:text-gray-100 hover:shadow-button" animatePress>
                Small
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
