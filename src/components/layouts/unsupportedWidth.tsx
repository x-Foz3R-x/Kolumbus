import Icon from "../icons";

export default function UnsupportedWidth() {
  return (
    <div className="unsupported-width flex h-screen w-screen min-w-fit flex-col items-center justify-center bg-gradient-to-br from-kolumblue-50 to-red-300 p-8 font-gordita">
      <div className="w-full overflow-hidden rounded-lg shadow-3xl">
        <div className="w-full bg-red-50 p-4">
          <Icon.logo className="mx-auto w-32 pb-1" />
        </div>
        <div className="flex w-full flex-col items-center gap-2 bg-red-500 p-6 text-center text-white shadow-md">
          <h1 className="pb-2 text-3xl font-medium">This screen is too small</h1>
          <p>Kolumbus requires a certain amount of screen space</p>
          <p className="text-lg font-medium underline">Please resize your screen</p>
        </div>
      </div>
    </div>
  );
}
