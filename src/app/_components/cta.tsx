import Carousel from "./carousel";
import { Icons, Link } from "~/components/ui";

export default function CTA() {
  return (
    <div className="relative h-[clamp(19.98rem,22.2vw,27.75rem)] overflow-hidden rounded-tr-[3rem] bg-kolumblue-400">
      <Carousel duration={20}>
        <div className="text-d-10xl font-bold leading-[0.6]">
          <div className="flex fill-kolumblue-100/75 text-kolumblue-100/75">
            <span className="pt-d3">K</span>
            <Icons.logo className="inline-block h-d22 animate-[spin_10s_linear_infinite_reverse]" />
            <span className="pt-d3">LUMBUS</span>
          </div>
          <div className="flex -scale-y-100 fill-kolumblue-300/50 text-kolumblue-300/50">
            <span className="pt-d3">K</span>
            <Icons.logo className="inline-block h-d22 animate-[spin_10s_linear_infinite]" />
            <span className="pt-d3">LUMBUS</span>
          </div>
        </div>
      </Carousel>
      <Carousel duration={20} reverse>
        <div className="text-d-10xl font-bold leading-[0.6]">
          <div className="flex fill-kolumblue-100/75 text-kolumblue-100/75">
            <span className="pt-d3">K</span>
            <Icons.logo className="inline-block h-d22 animate-[spin_10s_linear_infinite]" />
            <span className="pt-d3">LUMBUS</span>
          </div>
          <div className="flex -scale-y-100 fill-kolumblue-300/50 text-kolumblue-300/50">
            <span className="pt-d3">K</span>
            <Icons.logo className="inline-block h-d22 animate-[spin_10s_linear_infinite_reverse]" />
            <span className="pt-d3">LUMBUS</span>
          </div>
        </div>
      </Carousel>

      <div className="absolute top-0 flex h-1/2 w-full items-center justify-center pl-[25vw]">
        <h2 className="rounded-r-full bg-gradient-to-l from-kolumblue-100 via-kolumblue-300 to-transparent p-d6 text-right text-d-4xl font-bold text-gray-800 shadow-[5px_0px_3px_2px_rgba(0,0,0,0.1)]">
          Let’s Create Unforgettable Memories Together
        </h2>
      </div>

      <div className="absolute bottom-0 flex h-1/2 w-full items-center justify-center pr-[25vw]">
        <Link.Arrow
          href="/signup"
          variant="primary"
          size="d4xl"
          className="bg-gray-800 outline-gray-800"
        >
          Start Your Adventure
        </Link.Arrow>
      </div>

      <Icons.insetRadius className="absolute bottom-0 left-0 size-12 -rotate-90 fill-kolumblue-500" />
      <div className="absolute left-0 top-0 h-[25%] w-[25vw] rounded-br-[clamp(2.25rem,2.5vw,3.125rem)] bg-white">
        <Icons.insetRadius className="absolute -right-12 top-0 size-12 fill-white" />
        <Icons.insetRadius className="absolute -bottom-12 left-0 size-12 fill-white" />
      </div>
      <div className="absolute bottom-0 right-0 h-[25%] w-[25vw] rounded-tl-[clamp(2.25rem,2.5vw,3.125rem)] bg-kolumblue-500">
        <Icons.insetRadius className="absolute -top-12 right-0 size-12 rotate-180 fill-kolumblue-500" />
        <Icons.insetRadius className="absolute -left-12 bottom-0 size-12 rotate-180 fill-kolumblue-500" />
      </div>
    </div>
  );
}
