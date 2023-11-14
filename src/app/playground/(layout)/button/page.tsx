import Icon from "@/components/icons";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import Link from "next/link";

export default function ButtonTests() {
  return (
    <div className="h-screen w-screen bg-gray-50">
      <h1 className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex h-14 items-center justify-center text-lg font-medium text-gray-800">
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
        className="absolute z-20 flex items-center justify-center overflow-auto rounded-b-xl bg-white"
      >
        <div className="grid w-3/4 grid-cols-4 gap-3">
          <span className="border-b text-lg">Variants</span>
          <span className="col-span-3 border-b text-lg">Buttons</span>

          <span className="flex items-center">Default</span>
          <div className="col-span-3 flex items-center gap-4">
            <Button variant="default" size="lg" whileHover={{ scale: 1.08 }} animatePress>
              Large
            </Button>
            <Button variant="default" size="default" whileHover={{ scale: 1.08 }} className="bg-kolumblue-500 text-gray-100" animatePress>
              Default
            </Button>
            <Button variant="default" size="sm" whileHover={{ scale: 1.08 }} animatePress>
              Small
            </Button>
            <Button variant="default" size="icon" whileHover={{ scale: 1.08 }} animatePress>
              <span className="flex h-5 w-5 items-center">
                <Icon.horizontalDots className="w-5" />
              </span>
            </Button>
          </div>
          <span className="flex items-center">With shift</span>
          <div className="col-span-3 flex items-center gap-4">
            <Button variant="default" size="lg" focusVisible="default" shift animatePress className="w-32">
              Large
            </Button>
            <Button
              variant="default"
              size="default"
              focusVisible="default"
              shift
              animatePress
              className="w-28 bg-kolumblue-500 text-gray-100"
            >
              Default
            </Button>
            <Button variant="default" size="sm" focusVisible="default" shift animatePress className="w-20">
              Small
            </Button>
          </div>

          <Divider />
          <Divider className="col-span-3" />

          <span className="flex items-center">scaleInOut</span>
          <div className="col-span-3 flex items-center gap-4">
            <Button variant="scaleInOut" size="lg" hover="scaleInOut" focusVisible="scaleInOut" animatePress className="before:bg-gray-100">
              Large
            </Button>
            <Button
              variant="scaleInOut"
              size="default"
              hover="scaleInOut"
              focusVisible="scaleInOut"
              animatePress
              className="before:bg-kolumblue-500 hover:text-gray-100"
            >
              Default
            </Button>
            <Button variant="scaleInOut" size="sm" hover="scaleInOut" focusVisible="scaleInOut" animatePress className="before:bg-gray-100">
              Small
            </Button>
            <Button
              variant="scaleInOut"
              size="icon"
              hover="scaleInOut"
              focusVisible="scaleInOut"
              animatePress
              className="before:bg-gray-100"
            >
              <span className="flex h-5 w-5 items-center">
                <Icon.horizontalDots className="w-5" />
              </span>
            </Button>
          </div>
          <span className="flex items-center">With shift</span>
          <div className="col-span-3 flex items-center gap-4">
            <Button
              variant="scaleInOut"
              size="lg"
              hover="scaleInOut"
              focusVisible="scaleInOut"
              shift
              animatePress
              className="w-32 before:bg-gray-100"
            >
              Large
            </Button>
            <Button
              variant="scaleInOut"
              size="default"
              hover="scaleInOut"
              focusVisible="scaleInOut"
              shift
              animatePress
              className="w-28 before:bg-kolumblue-500 hover:text-gray-100"
            >
              Default
            </Button>
            <Button
              variant="scaleInOut"
              size="sm"
              hover="scaleInOut"
              focusVisible="scaleInOut"
              shift
              animatePress
              className="w-20 before:bg-gray-100"
            >
              Small
            </Button>
          </div>

          <Divider />
          <Divider className="col-span-3" />

          <span className="flex items-center">Button</span>
          <div className="col-span-3 flex items-center gap-4">
            <Button variant="button" size="lg" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}>
              Large
            </Button>
            <Button variant="button" size="default" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}>
              Default
            </Button>
            <Button
              variant="button"
              size="default"
              className="border-gray-600 bg-gray-500 text-gray-100"
              whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}
            >
              Default
            </Button>
            <Button
              variant="button"
              size="default"
              className="border-kolumblue-600 bg-kolumblue-500 text-gray-100"
              whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}
            >
              Default
            </Button>
            <Button
              variant="button"
              size="default"
              className="border-red-600 bg-red-500 text-gray-100"
              whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}
            >
              Default
            </Button>
            <Button variant="button" size="sm" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}>
              Small
            </Button>
            <Button variant="button" size="icon" whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.05 } }}>
              <span className="flex h-4 w-5 items-center">
                <Icon.horizontalDots className="w-5" />
              </span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
