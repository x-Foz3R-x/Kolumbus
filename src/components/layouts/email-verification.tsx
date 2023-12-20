"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";

import Icon from "../icons";
import CodeVerification from "../code-verification";
import { Button } from "../ui";

export default function EmailVerification({ reset }: { reset: () => void }) {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded || code.length !== 6) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/library");
      }
    } catch (error: unknown) {
      console.error(error);
      type Error = { errors: { code: string; message: string }[] };

      if ((error as Error).errors[0].code === "verification_failed" || (error as Error).errors[0].code === "verification_expired") reset();
      if ((error as Error).errors.length > 0) {
        setError((error as Error).errors[0].message);
      } else setError("An error occurred.");
    }
  };

  const handleResend = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (error: unknown) {
      console.error(error);

      if ((error as { errors?: { message: string }[] })?.errors && (error as { errors: { message: string }[] }).errors.length > 0) {
        setError((error as { errors: { message: string }[] }).errors[0].message);
      } else setError("An error occurred.");
    }
  };

  const getCensoredEmail = () => {
    if (!signUp?.emailAddress) return;
    const [emailName, emailDomain] = signUp.emailAddress.split("@");
    return `${emailName[0]}${emailName[1]}**@${emailDomain}`;
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Link href="/">
        <Icon.logo className="h-6" />
      </Link>
      <h1 className="mt-4 pb-1 text-2xl font-medium text-gray-800">Email Verification</h1>

      <form className="flex w-80 flex-col items-center">
        <p className="text-center text-sm text-gray-500">Verification code was send to your email {getCensoredEmail()}</p>
        {error && (
          <p className="mt-4 rounded-md bg-red-100 px-3 py-1 text-center text-sm text-red-500">
            {error === "is incorrect" ? "Incorrect verification code" : error}
          </p>
        )}

        <span className="py-5">
          <CodeVerification length={6} validChars="0-9" onComplete={(value) => setCode(value)} />
        </span>

        <span className="h-16 w-full">
          <Button
            onClick={handleVerification}
            variant="button"
            className="w-full border-kolumblue-600 bg-kolumblue-500 py-3 font-medium text-white"
          >
            Verify Email
          </Button>
        </span>

        <div className="text-center text-xs text-gray-500">
          Didn&apos;t receive code?&nbsp;
          <Button
            onClick={handleResend}
            variant="unstyled"
            size="unstyled"
            className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline"
          >
            Resend
          </Button>
        </div>
      </form>
    </div>
  );
}
