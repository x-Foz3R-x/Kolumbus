"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/nextjs";

import AuthProviders from "@/components/auth-providers";
import Input from "@/components/ui/input";
import Icon from "@/components/icons";
import Divider from "@/components/ui/divider";
import Button from "@/components/ui/button";

export default function SignIn() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { signOut } = useClerk();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded) return;

    signOut();

    const result = await signIn.create({ identifier: email, password });

    if (result.status === "complete") {
      await setActive({ session: result.createdSessionId });
      router.push("/library");
    }
  };

  // const handleGoogleSignIn = async () => {
  //   if (!isLoaded) return;

  //   const baseGoogleUrl = "https://accounts.google.com/o/oauth2/v2/auth";
  //   const clientId = "852909021816-k2i9cqjpqhe0mk3vrc77tbtasm1bl2dr.apps.googleusercontent.com";

  //   // const redirectUri = "https://clerk.kolumbus.app/v1/oauth_callback";
  //   const redirectUri = "https://tender-gelding-62.clerk.accounts.dev/v1/oauth_callback";

  //   const url = `${baseGoogleUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile`;

  //   console.log(url);

  //   const redirectUrl = `https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?access_type=offline&client_id=787459168867-0v2orf3qo56uocsi84iroseoahhuovdm.apps.googleusercontent.com&prompt=consent&redirect_uri=https%3A%2F%2Fclerk.shared.lcl.dev%2Fv1%2Foauth_callback&response_type=code&scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&state=wtxdmgotoaiyjv2v4p3m5d535ob5fpztc58ehzme&service=lso&o2v=1&theme=glif&flowName=GeneralOAuthFlow`;

  //   try {
  //     await signIn.authenticateWithRedirect({
  //       strategy: "oauth_google",
  //       redirectUrl: "/sso-callback",
  //       redirectUrlComplete: `/`,
  //     });
  //   } catch (error: unknown) {
  //     console.error(error);
  //   }

  //   // return signIn
  //   //   .authenticateWithRedirect({ strategy: "oauth_google", redirectUrl: "/", redirectUrlComplete: "/" })
  //   //   .catch((err) => console.error(err));
  // };

  return (
    <>
      <Link href="/">
        <Icon.logo className="h-8" />
      </Link>
      <h1 className="my-6 text-2xl font-medium">Sign in to Kolumbus</h1>

      <form className="w-80 rounded-lg shadow-soft">
        <div className="relative focus-within:z-10">
          <Input
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

          <span className="absolute inset-y-0 right-4 z-30 flex items-center"></span>
        </div>

        <div className="relative focus-within:z-10">
          <Input
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
            className="rounded-lg rounded-t-none py-3 pl-4 pr-12 text-base"
          />

          <span className="absolute inset-y-0 right-4 z-30 flex items-center">
            <Button
              onClick={handleSignIn}
              variant="unstyled"
              size="unstyled"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-150 ease-in focus:shadow-focus"
              disabled={!isLoaded}
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
          <span>Don&apos;t have an account? </span>
          <Link href="/sign-up" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
            Create yours now
            <Icon.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
          </Link>
        </div>
      </div>
    </>
  );
}
