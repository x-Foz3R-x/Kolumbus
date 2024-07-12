import Carousel from "./carousel";
import { Icons, Link } from "~/components/ui";

export default function CallToAction() {
  return (
    <div className="relative flex h-[27vw] items-center justify-center overflow-hidden text-white">
      <Link.Arrow
        href="signup"
        variant="primary"
        size="d2xl"
        className="relative z-20 bg-gray-800 shadow-2xl outline-gray-800"
      >
        Start Your Adventure
      </Link.Arrow>

      <div className="absolute left-0 top-0 z-10 h-[25%] w-[25vw] rounded-br-[3rem] bg-white">
        <Icons.insetRadius className="absolute -right-12 top-0 size-12 fill-white" />
        <Icons.insetRadius className="absolute -bottom-12 left-0 size-12 fill-white" />
      </div>
      <div className="absolute bottom-0 right-0 z-10 h-[25%] w-[25vw] rounded-tl-[3rem] bg-kolumblue-500">
        <Icons.insetRadius className="absolute -top-12 right-0 size-12 rotate-180 fill-kolumblue-500" />
        <Icons.insetRadius className="absolute -left-12 bottom-0 size-12 rotate-180 fill-kolumblue-500" />
      </div>

      <Icons.insetRadius className="absolute right-0 top-0 z-10 size-12 rotate-90 fill-white" />
      <Icons.insetRadius className="absolute bottom-0 left-0 z-10 size-12 -rotate-90 fill-kolumblue-500" />

      <Carousel duration={20} className="top-0 bg-kolumblue-400">
        <div className="text-[10vw] font-bold leading-[0.77]">
          <div className="relative z-10 flex h-[25%] fill-kolumblue-100 text-kolumblue-100">
            <h2 className="inline-block">K</h2>
            <Icons.logo className="inline-block size-[6.75vw] animate-[spin_10s_linear_infinite]" />
            <h2 className="inline-block">LUMBUS</h2>
          </div>
          <div className="-mt-[1.8vw] flex h-[25%] -scale-y-100 fill-kolumblue-300 text-kolumblue-300">
            <h2>K</h2>
            <Icons.logo className="size-[6.75vw] animate-[spin_10s_linear_infinite]" />
            <h2>LUMBUS</h2>
          </div>
        </div>
      </Carousel>
      <Carousel duration={20} className="bottom-0 bg-kolumblue-400" reverse>
        <div className="text-[10vw] font-bold leading-[0.77]">
          <div className="relative z-10 flex h-[25%] fill-kolumblue-100 text-kolumblue-100">
            <h2 className="inline-block">K</h2>
            <Icons.logo className="inline-block size-[6.75vw] animate-[spin_10s_linear_infinite]" />
            <h2 className="inline-block">LUMBUS</h2>
          </div>
          <div className="-mt-[1.8vw] flex h-[25%] -scale-y-100 fill-kolumblue-300 text-kolumblue-300">
            <h2>K</h2>
            <Icons.logo className="size-[6.75vw] animate-[spin_10s_linear_infinite]" />
            <h2>LUMBUS</h2>
          </div>
        </div>
      </Carousel>
    </div>
  );
}
