import Link from "next/link";
import Icon from "./icons";

export default function ContactWatermark() {
  return (
    <div className="absolute bottom-5 left-5 z-50 rounded-full bg-red-300/60 p-3 text-center font-inter text-[10px] font-semibold leading-tight text-red-700 backdrop-blur-sm">
      <span className="absolute inset-0 -z-10 rounded-full bg-red-400 blur" />
      <p>Found bug?</p>
      <Link href="/contact" target="_blank" className="px-4 hover:underline">
        Contact me <Icon.arrowTopRight className="mb-0.5 ml-0.5 inline h-1.5 fill-red-700" />
      </Link>
    </div>
  );
}
