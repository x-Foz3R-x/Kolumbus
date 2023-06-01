import React from "react";

import SubmitModal from "./submit";

import FormSeparatorSVG from "@/assets/svg/Separator.svg";

interface SubmitProps {
  handleClick?: any;
  isEnabled: boolean;
  className?: string;
}

/**
 * @param handleClick function that will be fired on click
 * @param isEnabled status of button
 * @param className tailwind styles
 */
export function Submit({ handleClick, isEnabled, className }: SubmitProps) {
  return (
    <SubmitModal
      handleClick={handleClick}
      isEnabled={isEnabled}
      className={className}
    />
  );
}

interface SeparatorProps {
  scale?: number;
}

/**
 * @param scale scale * 100 = width in px
 */
export function FormSeparator({ scale = 3.2 }: SeparatorProps) {
  return <FormSeparatorSVG className={`my-6 h-px scale-x-[${scale}]`} />;
}
