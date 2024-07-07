import Desktop from "./desktop";

export default function DemoOs() {
  return (
    <div className="relative flex h-fit w-full flex-col rounded-b-[3rem] rounded-tr-[3rem] bg-gray-800 py-24 font-inter">
      <div className="absolute -top-28 left-0 flex h-56 w-[50%] items-center justify-center rounded-t-[3rem] bg-gray-800">
        <p className="text-scale-sm text-balance px-[10%] text-center font-belanosima font-bold leading-none text-white">
          Discover the <span className="text-yellow-300"> Power </span>
          of Kolumbus
        </p>

        <span className="absolute -right-12 bottom-1/2 size-12 bg-gray-800" />
        <span className="absolute -right-12 bottom-1/2 size-12 rounded-bl-full bg-white" />
      </div>

      <Desktop />
    </div>
  );
}
