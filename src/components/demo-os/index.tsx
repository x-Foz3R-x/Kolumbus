import Desktop from "./desktop";

export default function DemoOs() {
  return (
    <div className="relative flex h-fit w-full flex-col rounded-b-[3rem] rounded-tr-[3rem] bg-gray-800 py-24 font-inter">
      <div className="text-scale-sm absolute -top-36 left-0 flex h-36 w-[40%] items-end justify-center rounded-t-[3rem] bg-gray-800 text-center font-belanosima font-bold text-white">
        <p className="h-8 px-8">
          Discover the <span className="text-yellow-300"> Power </span> of Kolumbus
        </p>
      </div>
      <span className="absolute -top-36 left-[40%] h-36 w-12 bg-gray-800" />
      <span className="absolute -top-36 left-[40%] h-36 w-12 rounded-bl-[3rem] bg-white" />
      <Desktop />
    </div>
  );
}
