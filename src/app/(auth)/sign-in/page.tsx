"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/nextjs";

import { IsEmail } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { KEYS } from "@/types";

import Icon from "@/components/icons";
import AuthProviders from "@/components/auth-providers";
import { Button, Divider, Input } from "@/components/ui";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();

  const [isEmailValid, setEmailValid] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    signOut();

    try {
      const result = await signIn.create({ identifier: email, password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/library");
      }
    } catch (error) {
      console.error(error);
      type Error = { errors: { code: string; message: string }[] };

      if ((error as Error).errors.length > 0) {
        setError((error as Error).errors[0].message);
      } else setError("An error occurred.");
    }
  };

  // OnAutofill validation.
  useEffect(() => {
    const handleAutofill = (e: AnimationEvent) => {
      if (e.animationName !== "autofillStart") return;

      setEmailValid(IsEmail(email));
    };

    document.addEventListener("animationstart", handleAutofill, true);
    return () => document.removeEventListener("animationstart", handleAutofill, true);
  }, [email, password]);

  return (
    <main className="flex h-screen w-screen min-w-fit flex-col items-center justify-center overflow-hidden">
      <Link href="/">
        <Icon.logo className="h-6" />
      </Link>
      <h1 className="my-4 pb-1 text-2xl font-medium text-gray-800">Sign in to Kolumbus</h1>

      {error && <span className="mx-auto mb-4 rounded-md bg-red-100 px-2 py-0.5 text-red-500">{error}</span>}

      <form className="w-80 rounded-lg shadow-soft">
        <div className="relative focus-within:z-10">
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmailValid(IsEmail(e.target.value))}
            onInput={(e) => setEmail(e.currentTarget.value)}
            autoComplete="email"
            autoCorrect="off"
            spellCheck="false"
            className="detectAutofill mb-px rounded-lg rounded-b-none px-4 py-3 text-base"
          />

          <span className="absolute inset-y-0 right-4 z-30 flex items-center"></span>
        </div>

        <div className="relative focus-within:z-10">
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onInput={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => e.key === KEYS.Enter}
            autoComplete="current-password"
            autoCorrect="off"
            spellCheck="false"
            className="rounded-lg rounded-t-none py-3 pl-4 pr-12 text-base"
          />

          <span className="absolute inset-y-0 right-4 z-30 flex items-center">
            <Button
              onClick={(e) => {
                e.preventDefault();
                handleSignIn();
              }}
              variant={isLoaded && isEmailValid && password.length >= 8 ? "unset" : "disabled"}
              size="unset"
              className={cn(
                "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-100 ease-in",
                isLoaded && isEmailValid && password.length >= 8 ? "focus:shadow-focus" : "cursor-default focus:shadow-focusError",
              )}
            >
              <Icon.arrowRight className="h-full w-4 fill-gray-700" />
            </Button>
          </span>
        </div>
      </form>

      <Divider gradient className="my-6  w-80" />

      <AuthProviders />

      <div className="mt-6 flex flex-col items-center justify-center text-xs">
        <span className="cursor-default select-none text-kolumblue-600 opacity-40">Forgot password?</span>
        {/* <Link href="/" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
          Forgot password?
        </Link> */}

        <div>
          <span>Don’t have an account? </span>
          <Link href="/sign-up" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
            Create yours now
            <Icon.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
          </Link>
        </div>
      </div>
    </main>
  );
}
