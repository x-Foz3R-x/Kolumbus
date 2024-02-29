import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { KEY } from "@/types";
import { Input } from "./ui";

type CodeVerificationProps = {
  length: number;
  validChars?: string;
  onComplete?: (input: string) => void;
};
export default function CodeVerification({ length, validChars = "0-9", onComplete }: CodeVerificationProps) {
  const [value, setValue] = useState("");
  const [isFocused, setFocused] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\s/g, "");

    if (RegExp(`^[${validChars}]{0,${length}}$`).test(value)) {
      setValue(value);

      if (value.length === length) {
        inputRef.current?.blur();
        setFocused(false);
        onComplete?.(value);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ([KEY.ArrowUp, KEY.ArrowDown, KEY.ArrowLeft, KEY.ArrowRight, KEY.Home, KEY.End].includes(e.key as KEY)) e.preventDefault();
  };

  const isCharacterFilled = (index: number) => value.length > index;
  const isCharacterSelected = (index: number) =>
    (value.length === index || (value.length === index + 1 && length === index + 1)) && isFocused;

  return (
    <div className="relative h-12 select-none">
      <Input
        id="one-time-code"
        name="one-time-code"
        ref={inputRef}
        type="number"
        value={value}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label="Verification input"
        autoComplete="one-time-code"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
        variant="unset"
        size="unset"
        className="absolute inset-0 -z-10 bg-transparent text-transparent caret-transparent autofill:appearance-none autofill:bg-transparent autofill:shadow-none autofill:focus:shadow-none"
      />
      <ul className="flex h-full w-full gap-2.5">
        {[...Array(length)].map((_, index) => (
          <li
            key={index}
            onClick={() => {
              inputRef.current?.focus();
              setFocused(true);
            }}
            className={cn(
              "flex h-full w-10 cursor-text select-none items-center justify-center rounded-lg bg-white font-gordita text-xl font-medium dark:bg-gray-1000",
              isCharacterFilled(index)
                ? "border-gray-100 bg-gray-100 text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-white"
                : "text-gray-300 dark:border-gray-800 dark:text-gray-700",
              isCharacterSelected(index) ? "bg-white shadow-focus dark:bg-gray-1000" : "border shadow-softSm",
            )}
          >
            {isCharacterFilled(index) ? value[index] : isCharacterSelected(index) ? "_" : "•"}
          </li>
        ))}
      </ul>
    </div>
  );
}
