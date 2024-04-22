import { Button } from "~/components/ui";

export default function ButtonTests() {
  return (
    <>
      {/* Default */}
      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Default</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="default"
              size="lg"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
            >
              Large
            </Button>
            <Button
              variant="default"
              size="default"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
            >
              Default
            </Button>
            <Button
              variant="default"
              size="sm"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.98 }}
            >
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
      </div>

      {/* Scale */}
      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Scale</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
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
            <Button
              variant="scale"
              size="lg"
              className="before:bg-gray-500 hover:text-gray-100 focus-visible:text-gray-100"
              animatePress
            >
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
            <Button
              variant="scale"
              size="sm"
              className="before:bg-red-500 hover:text-gray-100 focus-visible:text-gray-100"
              animatePress
            >
              Small
            </Button>
          </div>
        </div>
      </div>

      {/* Button */}
      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Button</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center justify-center gap-4">
            <span className="h-11">
              <Button
                variant="button"
                size="lg"
                whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
              >
                Large
              </Button>
            </span>
            <Button
              variant="button"
              size="default"
              whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
            >
              Default
            </Button>
            <Button
              variant="button"
              size="sm"
              whileTap={{ borderBottomWidth: "1px", transition: { duration: 0.03 } }}
            >
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
      </div>

      {/* Appear */}
      <div>
        <h3 className="font-belanosima text-lg font-semibold text-gray-500">Appear</h3>

        <div className="select-none space-y-4 rounded-lg border border-gray-100 bg-gray-50 p-5">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="appear"
              size="lg"
              className="hover:bg-gray-100 hover:shadow-button"
              animatePress
            >
              Large
            </Button>
            <Button
              variant="appear"
              size="default"
              className="hover:bg-gray-100 hover:shadow-button"
              animatePress
            >
              Default
            </Button>
            <Button
              variant="appear"
              size="sm"
              className="hover:bg-gray-100 hover:shadow-button"
              animatePress
            >
              Small
            </Button>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="appear"
              size="lg"
              className="hover:bg-gray-500 hover:text-gray-100 hover:shadow-button"
              animatePress
            >
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
            <Button
              variant="appear"
              size="sm"
              className="hover:bg-red-500 hover:text-gray-100 hover:shadow-button"
              animatePress
            >
              Small
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
