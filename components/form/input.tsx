"use client";
import { useState } from "react";

interface Props {
  isBorderBlankFocus: boolean;
  setInput: Function;
  type?: string;
  isBorderBlank?: boolean;
  placeholder?: string;
  test?: any;
}

export default function InputModal({
  isBorderBlankFocus,
  setInput,
  type,
  isBorderBlank = false,
  placeholder,
  test,
}: Props) {
  const [isFocus, setIsFocus] = useState(false);

  const handleFocus = () => {
    if (isBorderBlank) setInput(true);
    setIsFocus(true);
  };

  const handleBlur = () => {
    if (isBorderBlank) setInput(false);
    setIsFocus(false);
  };

  let typeStyle: string;
  switch (type) {
    case "top":
      typeStyle =
        "rounded-t-md " +
        ((isBorderBlank && !isFocus) || (!isBorderBlank && isBorderBlankFocus)
          ? "border-b-0 h-[calc(3rem-1px)] "
          : "h-12 ");
      break;
    case "mid":
      typeStyle =
        "rounded-none " +
        ((isBorderBlank && !isFocus) || (!isBorderBlank && isBorderBlankFocus)
          ? "border-y-0 h-[calc(3rem-1px)] "
          : "h-12 ");
      break;
    case "bot":
      typeStyle =
        "rounded-b-md " +
        ((isBorderBlank && !isFocus) || (!isBorderBlank && isBorderBlankFocus)
          ? "border-t-0 h-[calc(3rem-1px)] "
          : "h-12 ");
      break;
    default:
      typeStyle = "rounded-md ";
      break;
  }

  return (
    <input
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={
        "relative z-10 w-80 appearance-none rounded-md border px-4 text-base font-normal outline-0 focus:border-kolumblue-600 focus:shadow-focus focus:outline-none focus:outline-0 " +
        typeStyle +
        (isFocus ? "z-10 " : " ")
      }
      placeholder={placeholder}
    />
  );
}
