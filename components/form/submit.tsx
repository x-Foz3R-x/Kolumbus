"use client";

import ArrowSVG from "@/assets/svg/arrows/Arrow.svg";

interface Props {
  handleClick?: any;
  isEnabled: boolean;
  className?: string;
}

export default function SubmitModal({
  handleClick,
  isEnabled,
  className,
}: Props) {
  return (
    <button
      onClick={handleClick}
      className={
        "absolute z-20 h-7 w-7 rounded-full border " +
        (isEnabled ? "border-kolumbGray-800 " : "border-kolumbGray-300 ") +
        className
      }
    >
      <ArrowSVG
        className={
          "m-auto h-3 " +
          (isEnabled ? "fill-kolumbGray-800 " : "fill-kolumbGray-300 ")
        }
      />
    </button>
  );
}
