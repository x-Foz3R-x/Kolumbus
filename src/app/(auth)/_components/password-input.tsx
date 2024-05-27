"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { Input, type InputProps } from "@/components/input copy";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";

type Props = InputProps & { type: "password"; children?: undefined };
export default function PasswordInput(props: Props) {
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.value !== undefined && props.value.toString().length === 0) setShowPassword(false);
  }, [props.value]);

  return (
    <Input
      {...props}
      className={{ ...props.className, input: cn("pr-11", props.className?.input) }}
      type={showPassword ? "text" : "password"}
    >
      <Button
        onClick={(e) => {
          e.preventDefault();
          setShowPassword(!showPassword);
        }}
        variant="unset"
        size="icon"
        className={cn(
          "absolute right-4 top-3 my-px size-[22px] rounded-[5px] bg-gray-200/50 p-0.5 duration-100 ease-in peer-focus:translate-y-2",
          props.value !== undefined && props.value.toString().length > 0 && "pointer-events-auto translate-y-2",
          props.value !== undefined && props.value.toString().length === 0 && "pointer-events-none opacity-50",
        )}
      >
        {showPassword ? <Icons.eyeSlash strokeWidth={1.6} /> : <Icons.eye strokeWidth={1.6} />}
      </Button>
    </Input>
  );
}
