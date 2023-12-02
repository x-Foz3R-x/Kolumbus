"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useClerk } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/nextjs";

import Input from "@/components/ui/input";
import Icon from "@/components/icons";
import Button from "@/components/ui/button";
import { motion } from "framer-motion";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agreement, setAgreement] = useState(false);
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      signOut();

      // Create the user.
      await signUp.create({ emailAddress: email, password, username });

      // Send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Move to verification section.
      setAgreement(false);
      setVerification(true);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleVerification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded || code.length !== 6) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/library");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setAgreement(false);
    setVerification(false);
    setCode("");
  };

  return (
    <>
      <motion.div
        initial={{ scale: 1 }}
        animate={{
          y: agreement || verification ? "-25%" : 0,
          scale: agreement || verification ? 0 : 1,
          opacity: agreement || verification ? 0 : 1,
          transition: { duration: 1, ease: "anticipate" },
        }}
        className="absolute flex h-screen flex-col items-center justify-center"
      >
        <Link href="/">
          <Icon.logo className="h-6" />
        </Link>
        <h1 className="my-4 pb-1 text-2xl font-medium text-gray-800">Create your account</h1>

        <form className="relative flex w-[22rem] flex-col rounded-lg shadow-soft">
          <div className="relative focus-within:z-10">
            <Input
              id="username"
              name="username"
              type="text"
              label="Username *"
              value={username}
              onInput={(e) => {
                setUsername(e.currentTarget.value);
                console.log("validate username");
              }}
              variant="insetLabel"
              className="mb-px rounded-b-none"
              autoComplete="username"
              autoCorrect="off"
              spellCheck="false"
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center"></span>
          </div>

          <div className="relative focus-within:z-10">
            <Input
              id="email"
              name="email"
              type="email"
              label="E-mail *"
              value={email}
              onInput={(e) => {
                setEmail(e.currentTarget.value);
                console.log("validate email");
              }}
              variant="insetLabel"
              className="mb-px rounded-none"
              autoComplete="email"
              autoCorrect="off"
              spellCheck="false"
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center"></span>
          </div>

          <div className="relative focus-within:z-10">
            <Input
              id="password"
              name="password"
              type="password"
              label="Password *"
              value={password}
              onInput={(e) => {
                setPassword(e.currentTarget.value);
                console.log("validate password");
              }}
              variant="insetLabel"
              className="mb-px rounded-none"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center"></span>
          </div>

          <div className="relative focus-within:z-10">
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              label="Confirm Password *"
              value={confirmPassword}
              onInput={(e) => {
                setConfirmPassword(e.currentTarget.value);
                console.log("validate confirm password");
              }}
              variant="insetLabel"
              className="rounded-t-none pr-12"
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setAgreement(true);
                }}
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

        <div className="mt-5 flex flex-col items-center justify-center text-xs">
          <div>* Required Fields</div>

          <div>
            <span>Already have an account? </span>
            <Link href="/sign-in" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
              Sign in here
              <Icon.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "25%", scale: 0, opacity: 0 }}
        animate={{
          y: agreement ? 0 : "25%",
          scale: agreement ? 1 : 0,
          opacity: agreement ? 1 : 0,
          transition: { duration: 1, ease: "anticipate" },
        }}
        className="absolute flex h-screen flex-col items-center justify-center overflow-auto"
      >
        <Link href="/">
          <Icon.logo className="h-6" />
        </Link>
        <h1 className="my-4 text-2xl font-medium text-gray-800">Privacy and Terms</h1>

        <div className="flex w-80 flex-col gap-4">
          <p className="text-sm leading-6 text-gray-700">
            Before proceeding, please take a moment to carefully review and acknowledge our <br />
            <Link href="/terms" className="font-medium text-kolumblue-500">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link href="/privacy" className="font-medium text-kolumblue-500">
              Privacy Policy
            </Link>
            . By choosing &quot;I agree&quot; you agree to these terms and policies.
          </p>

          <p className="text-sm leading-6 text-gray-700">
            These documents outline the rules and protective measures, ensuring the confidentiality of your information and offering clear
            guidance on what you can anticipate.
          </p>

          <p className="text-sm leading-6 text-gray-700">
            Have questions?&nbsp;
            <Link href="/contact" className="font-medium text-kolumblue-500">
              Contact us
            </Link>
          </p>

          <span className="flex justify-between gap-4 font-medium">
            <Button onClick={handleCancel} variant="appear" className="px-3 py-2 text-kolumblue-500 hover:bg-gray-100" disabled={!isLoaded}>
              Cancel
            </Button>

            <Button
              onClick={handleSignUp}
              className="bg-kolumblue-500 px-5 py-2 text-white duration-200 ease-kolumb-flow hover:bg-kolumblue-550"
              disabled={!isLoaded}
            >
              I agree
            </Button>
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: "25%", scale: 0, opacity: 0 }}
        animate={{
          y: verification ? 0 : "25%",
          scale: verification ? 1 : 0,
          opacity: verification ? 1 : 0,
          transition: { duration: 1, ease: "anticipate" },
        }}
        className="absolute flex h-screen flex-col items-center justify-center"
      >
        <Link href="/">
          <Icon.logo className="h-6" />
        </Link>
        <h1 className="my-4 pb-1 text-2xl font-medium text-gray-800">Verify email</h1>

        <form className="relative flex w-[22rem] flex-shrink-0 flex-col gap-6">
          <Input
            type="number"
            label="Verification code"
            value={code}
            onInput={(e) => setCode(e.currentTarget.value)}
            autoCorrect="off"
            spellCheck="false"
            variant="insetLabel"
          />

          <span
            className={`absolute inset-y-0 right-4 z-30 flex items-center ${!isLoaded || (code.length !== 6 && "pointer-events-none")}`}
          >
            <Button
              onClick={handleVerification}
              variant="unstyled"
              size="unstyled"
              className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-150 ease-in focus:shadow-focus"
              disabled={!isLoaded || code.length !== 6}
            >
              <Icon.arrowRight className="h-full w-4 fill-gray-700" />
            </Button>
          </span>
        </form>

        <div className="mt-5 flex flex-col items-center justify-center text-xs">
          <div>
            <span>Already have an account? </span>
            <Link href="/sign-in" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
              Sign in here
              <Icon.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
            </Link>
          </div>
        </div>
      </motion.div>
    </>
  );
}
