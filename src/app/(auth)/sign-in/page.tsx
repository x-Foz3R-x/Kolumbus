"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/nextjs";

import AuthProviders from "@/components/auth-providers";
import Checkbox from "@/components/ui/checkbox/checkbox";
import { StatelessInput } from "@/components/ui/input";
import Icon from "@/components/icons";
import Divider from "@/components/ui/divider";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      signOut();

      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        console.log(result);
        await setActive({ session: result.createdSessionId });
        router.push("/library");
      } else {
        console.log(result);
      }
    } catch (error: any) {
      console.error("error", error.errors[0].longMessage);
    }
  };

  return (
    <>
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="my-6 text-2xl font-medium">Sign in to Kolumbus</h1>

      <form className="relative flex w-80 flex-col gap-6">
        <div className="rounded-lg shadow-soft">
          <StatelessInput
            id="email"
            name="email"
            type="email"
            placeholder="E-mail"
            onChange={(e) => {
              setEmail(e.target.value);
              console.log("validate email");
            }}
            autoComplete="email"
            autoCorrect="off"
            spellCheck="false"
            className="mb-px rounded-lg rounded-b-none px-4 py-3 text-base"
          />

          <StatelessInput
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
              console.log("validate password");
            }}
            autoComplete="current-password"
            autoCorrect="off"
            spellCheck="false"
            className="mb-px rounded-lg rounded-t-none px-4 py-3 pr-12 text-base"
          />
        </div>

        <Checkbox isChecked={rememberMe} setIsChecked={setRememberMe}>
          Remember me
        </Checkbox>

        <button
          onClick={handleSubmit}
          className={`absolute bottom-[3.625rem] right-4 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-150 ease-in focus:shadow-focus`}
        >
          <Icon.arrowRight className={`h-full w-4 fill-gray-700`} />
        </button>
      </form>

      <Divider gradient className="my-6 mt-4 w-80" />

      <AuthProviders />
      <div className="mt-6 flex flex-col items-center justify-center text-xs">
        <Link href="/" className="text-kolumblue-600 hover:underline">
          Forgot password?
        </Link>

        <div>
          <span>Don&apos;t have an account? </span>
          <Link href="/sign-up" className="text-kolumblue-600 hover:underline">
            Create yours now
            <Icon.chevron className="mb-[0.0625rem] ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
          </Link>
        </div>
      </div>
    </>
  );
}
