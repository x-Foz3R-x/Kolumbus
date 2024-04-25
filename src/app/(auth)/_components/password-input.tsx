"use client";

import { useState } from "react";
import { Button, Input, type InputProps } from "~/components/ui";
import { cn } from "~/lib/utils";

type Props = InputProps & { type: "password"; children?: undefined };
export default function PasswordInput(props: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      className={{ ...props.className, input: cn("pr-[3.25rem]", props.className?.input) }}
      type={showPassword ? "text" : "password"}
    >
      <div
        className={cn(
          "absolute inset-y-0 right-4 flex items-center justify-center duration-100 ease-in peer-focus:translate-y-2",
          props.value !== undefined && props.value.toString().length > 0 && "translate-y-2",
        )}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            setShowPassword(!showPassword);
          }}
          variant="unset"
          size="icon"
          className="size-[22px] rounded-md bg-gray-200/50"
        ></Button>
      </div>
    </Input>
  );
}
