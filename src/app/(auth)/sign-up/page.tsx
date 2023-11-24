"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/nextjs";

import Checkbox from "@/components/ui/checkbox/checkbox";
import { StatelessInput } from "@/components/ui/input";
import Icon from "@/components/icons";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [iAccept, setIAccept] = useState(false);

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  // start the sign up process.
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!isLoaded) {
      console.log("try again");
      return;
    }

    try {
      signOut();
      await signUp.create({
        emailAddress: email,
        password,
        username,
      });

      // send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // change the UI to our pending section.
      setPendingVerification(true);
    } catch (error: any) {
      console.error(JSON.stringify(error, null, 2));
    }
  };

  // This verifies the user using email code that is delivered.
  const handleVerify = async (e: any) => {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/library");
      }
      if (completeSignUp.status !== "complete") console.log(JSON.stringify(completeSignUp, null, 2));
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <>
      <div
        className={`absolute top-0 flex h-screen flex-col items-center justify-center duration-1000 ease-in ${
          pendingVerification && "-translate-y-full scale-0"
        }`}
      >
        <Link href="/">
          <Icon.logo className="h-8" />
        </Link>
        <h1 className="pb-6 pt-3 text-xl font-medium text-gray-900">Create your account</h1>

        <form className="relative flex w-[22rem] flex-shrink-0 flex-col gap-6">
          <div className="rounded-lg shadow-soft">
            <StatelessInput
              id="username"
              name="username"
              type="text"
              label="Username *"
              onChange={(e) => {
                setUsername(e.target.value);
                console.log("validate username");
              }}
              variant="insetLabel"
              className="mb-px rounded-b-none"
              autoComplete="username"
              autoCorrect="off"
              spellCheck="false"
            />

            <StatelessInput
              id="email"
              name="email"
              type="email"
              label="E-mail *"
              onChange={(e) => {
                setEmail(e.target.value);
                console.log("validate email");
              }}
              variant="insetLabel"
              className="mb-px rounded-none"
              autoComplete="email"
              autoCorrect="off"
              spellCheck="false"
            />

            <StatelessInput
              id="password"
              name="password"
              type="password"
              label="Password *"
              onChange={(e) => {
                setPassword(e.target.value);
                console.log("validate password");
              }}
              variant="insetLabel"
              className="mb-px rounded-none"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />

            <StatelessInput
              id="confirm-password"
              name="confirm-password"
              type="password"
              label="Confirm Password *"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                console.log("validate confirm password");
              }}
              variant="insetLabel"
              className="rounded-t-none pr-12"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>

          <Checkbox isChecked={iAccept} setIsChecked={setIAccept}>
            I accept the{" "}
            <Link href="/" target="_blank" className="text-kolumblue-600 hover:underline">
              Terms of Use
              <Icon.arrowTopRight className="mb-3 ml-1 inline h-1.5 fill-kolumblue-600" />
            </Link>{" "}
            &{" "}
            <Link href="/" target="_blank" className="text-kolumblue-600 hover:underline">
              Privacy Policy
              <Icon.arrowTopRight className="mb-3 ml-1 inline h-1.5 fill-kolumblue-600" />
            </Link>{" "}
            *
          </Checkbox>

          <button
            onClick={handleSubmit}
            className={`absolute bottom-[3.75rem] right-4 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-150 ease-in focus:shadow-focus`}
          >
            <Icon.arrowRight className={`h-full w-4 fill-gray-700`} />
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center justify-center text-xs">
          <div>* Required Fields</div>

          <div>
            <span>Already have an account? </span>
            <Link href="/sign-in" className="text-kolumblue-600 hover:underline">
              Sign in here
              <Icon.chevron className="mb-[0.0625rem] ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`absolute top-0 flex h-screen flex-col items-center justify-center duration-1000 ease-in-out ${
          !pendingVerification && "translate-y-full scale-0"
        }`}
      >
        <Link href="/">
          <Icon.logo className="h-8" />
        </Link>
        <h1 className="pb-6 pt-3 text-xl font-medium text-gray-900">Verify email</h1>

        <form className="relative flex w-[22rem] flex-shrink-0 flex-col gap-6">
          <div className="rounded-lg shadow-soft">
            <StatelessInput value={code} label="Verification code" onChange={(e) => setCode(e.target.value)} variant="insetLabel" />
          </div>

          <button
            onClick={handleVerify}
            className={`absolute bottom-3 right-4 z-40 flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-150 ease-in focus:shadow-focus`}
          >
            <Icon.arrowRight className={`h-full w-4 fill-gray-700`} />
          </button>
        </form>

        <div className="mt-5 flex flex-col items-center justify-center text-xs">
          <div>
            <span>Already have an account? </span>
            <Link href="/sign-in" className="text-kolumblue-600 hover:underline">
              Sign in here
              <Icon.chevron className="mb-[0.0625rem] ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
