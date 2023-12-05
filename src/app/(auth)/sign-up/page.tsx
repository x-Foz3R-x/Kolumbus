"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/nextjs";

import { isEmail, validatePassword, validateUsername } from "@/lib/validation";
import { cn } from "@/lib/utils";

import Icon from "@/components/icons";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Divider from "@/components/ui/divider";
import { TooltipTrigger } from "@/components/ui/tooltip";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isUsernameValid, setUsernameValid] = useState<[boolean, boolean, boolean]>();
  const [isEmailValid, setEmailValid] = useState<boolean>();
  const [isPasswordValid, setPasswordValid] = useState<[boolean, boolean, boolean, boolean]>();
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState<boolean>();

  const [agreement, setAgreement] = useState(false);
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");

  const router = useRouter();

  const handleContinueToAgreement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (username.length === 0) setUsernameValid([false, false, false]);
    if (email.length === 0) setEmailValid(false);
    if (password.length === 0) setPasswordValid([false, false, false, false]);
    if (confirmPassword !== password) setConfirmPasswordValid(false);

    if (
      isLoaded &&
      isUsernameValid?.every((validation) => validation) &&
      isEmailValid &&
      isPasswordValid?.every((validation) => validation) &&
      isConfirmPasswordValid
    ) {
      setAgreement(true);
    }
  };
  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setUsernameValid(undefined);
    setEmailValid(undefined);
    setPasswordValid(undefined);
    setConfirmPasswordValid(undefined);

    setAgreement(false);
    setVerification(false);
    setCode("");
  };
  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded) return;
    signOut();

    try {
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

  const getIcon = (isValid?: boolean) => {
    if (typeof isValid === "undefined") return <Icon.circleQuestionMark className="h-4 w-4 rounded-full fill-kolumblue-500 shadow-soft" />;
    return isValid ? (
      <Icon.circleCheck className="h-4 w-4 rounded-full fill-green-500 shadow-soft" />
    ) : (
      <Icon.circleExclamation className="h-4 w-4 rounded-full fill-red-500 shadow-soft" />
    );
  };
  const getStyle = (isValid?: boolean) => {
    if (typeof isValid === "undefined") return { text: "text-gray-400", bg: "bg-gray-400" };
    return isValid ? { text: "text-green-500", bg: "bg-green-500" } : { text: "text-red-500", bg: "bg-red-500" };
  };

  const getUsernameLabel = () => {
    const isUsernameValid = validateUsername(username);
    if (!isUsernameValid || username.length === 0) return "Username *";
    if (!isUsernameValid[0] && username.length < 5) return "At least 5 characters in length";
    if (!isUsernameValid[1]) return "Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)";
    if (!isUsernameValid[2]) return "Blacklisted";
    return "Username *";
  };
  const getPasswordLabel = () => {
    const isPasswordValid = validatePassword(password);
    if (password.length === 0 || !isPasswordValid) return "Password *";
    if (!isPasswordValid[0]) return "At least 8 characters in length";
    if (!isPasswordValid[1]) return "Should contain lower case letters (a-z)";
    if (!isPasswordValid[2]) return "Should contain upper case letters (A-Z)";
    if (!isPasswordValid[3]) return "Should contain numbers (0-9) or symbols";
    return "Password *";
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
        className="absolute flex h-screen w-screen flex-col items-center justify-center"
      >
        <Link href="/">
          <Icon.logo className="h-6" />
        </Link>
        <h1 className="my-4 pb-1 text-2xl font-medium text-gray-800">Create your account</h1>

        <form className="relative flex w-[22rem] flex-col rounded-lg shadow-soft">
          <div
            className={cn(
              "relative focus-within:z-20",
              isUsernameValid?.some((validation) => !validation) && username.length > 0 && "z-10",
            )}
          >
            <Input
              id="username"
              name="username"
              type="text"
              label={getUsernameLabel()}
              value={username}
              onInput={(e) => setUsername(e.currentTarget.value)}
              onChange={(e) => setUsernameValid(validateUsername(e.currentTarget.value))}
              autoComplete="username"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-b-none duration-200 ease-kolumb-flow",
                isUsernameValid?.some((validation) => !validation) && "focus:shadow-focusError",
                isUsernameValid?.some((validation) => !validation) && username.length > 0 && "shadow-borderError bg-red-100 focus:bg-white",
              )}
              labelClassName={cn(isUsernameValid?.some((validation) => !validation) && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <TooltipTrigger
                placement="right"
                arrow={{ size: 15 }}
                className="flex w-60 flex-col gap-1.5 px-5 py-3 text-xs"
                buttonProps={{
                  variant: "unstyled",
                  size: "unstyled",
                  children: getIcon(isUsernameValid?.every((validation) => validation)),
                }}
              >
                <div className={cn("flex gap-2", getStyle(isUsernameValid?.[0]).text)}>
                  <span
                    role="presentation"
                    className={cn("mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft", getStyle(isUsernameValid?.[0]).bg)}
                  />
                  At least 5 characters in length
                </div>
                <div className={cn("flex gap-2", getStyle(isUsernameValid?.[1]).text)}>
                  <span
                    role="presentation"
                    className={cn("mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft", getStyle(isUsernameValid?.[1]).bg)}
                  />
                  Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)
                </div>

                <Divider gradient className="my-1 via-gray-600" />

                <p>Ride smoothly through the digital highways with an adventurous username!</p>
              </TooltipTrigger>
            </span>
          </div>

          <div className={cn("relative focus-within:z-20", isEmailValid === false && email.length > 0 && "z-10")}>
            <Input
              id="email"
              name="email"
              type="email"
              label={isEmailValid === false && email.length > 0 ? "Invalid email *" : "Email *"}
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
              onChange={(e) => setEmailValid(isEmail(e.currentTarget.value))}
              autoComplete="email"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-none duration-200 ease-kolumb-flow",
                isEmailValid === false && "focus:shadow-focusError",
                isEmailValid === false && email.length > 0 && "shadow-borderError bg-red-100 focus:bg-white",
              )}
              labelClassName={cn(isEmailValid === false && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <TooltipTrigger
                placement="right"
                arrow={{ size: 15 }}
                className="flex w-60 flex-col gap-1.5 px-5 py-3 text-xs"
                buttonProps={{
                  variant: "unstyled",
                  size: "unstyled",
                  children: getIcon(isEmailValid),
                }}
              >
                <div className={cn("flex gap-2", getStyle(isEmailValid).text)}>
                  <span
                    role="presentation"
                    className={cn("mt-[3px] h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft", getStyle(isEmailValid).bg)}
                  />
                  name@example.com
                </div>

                <Divider gradient className="my-1 via-gray-600" />

                <p>Sail smoothly into our inbox with joyous emails from new users!</p>
              </TooltipTrigger>
            </span>
          </div>

          <div
            className={cn(
              "relative focus-within:z-20",
              isPasswordValid?.some((validation) => !validation) && password.length > 0 && "z-10",
            )}
          >
            <Input
              id="password"
              name="password"
              type="password"
              label={getPasswordLabel()}
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
              onChange={(e) => setPasswordValid(validatePassword(e.currentTarget.value))}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-none pr-12 duration-200 ease-kolumb-flow",
                isPasswordValid?.some((validation) => !validation) && "focus:shadow-focusError",
                isPasswordValid?.some((validation) => !validation) && password.length > 0 && "shadow-borderError bg-red-100 focus:bg-white",
              )}
              labelClassName={cn(isPasswordValid?.some((validation) => !validation) && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <TooltipTrigger
                placement="right"
                arrow={{ size: 15 }}
                className="flex w-60 flex-col gap-1.5 px-5 py-3 text-xs"
                buttonProps={{
                  variant: "unstyled",
                  size: "unstyled",
                  children: getIcon(isPasswordValid?.every((validation) => validation)),
                }}
              >
                <div className={cn("flex gap-2", getStyle(isPasswordValid?.[0]).text)}>
                  <span
                    role="presentation"
                    className={cn("mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft", getStyle(isPasswordValid?.[0]).bg)}
                  />
                  At least 8 characters in length
                </div>
                <div className={cn("flex gap-2", getStyle(isPasswordValid?.[1] && isPasswordValid?.[2] && isPasswordValid?.[3]).text)}>
                  <span
                    role="presentation"
                    className={cn(
                      "mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft",
                      getStyle(isPasswordValid?.[1] && isPasswordValid?.[2] && isPasswordValid?.[3]).bg,
                    )}
                  />
                  Should contain:
                </div>
                <div className="pl-4.5 flex flex-col gap-1">
                  <div className={cn("flex gap-2", isPasswordValid?.[1] ? "text-green-500" : "text-gray-400")}>
                    <span
                      role="presentation"
                      className={cn(
                        "mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft",
                        isPasswordValid?.[1] ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    Lower case letters (a-z)
                  </div>
                  <div className={cn("flex gap-2", isPasswordValid?.[2] ? "text-green-500" : "text-gray-400")}>
                    <span
                      role="presentation"
                      className={cn(
                        "mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft",
                        isPasswordValid?.[2] ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    Upper case letters (A-Z)
                  </div>
                  <div className={cn("flex gap-2", isPasswordValid?.[3] ? "text-green-500" : "text-gray-400")}>
                    <span
                      role="presentation"
                      className={cn(
                        "mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft",
                        isPasswordValid?.[3] ? "bg-green-500" : "bg-gray-400",
                      )}
                    />
                    Numbers (0-9) or symbols
                  </div>
                </div>

                <Divider gradient className="my-1 via-gray-600" />

                <p>Fly smoothly through our security gates with a password that soars securely!</p>
              </TooltipTrigger>
            </span>
          </div>

          <div className={cn("relative focus-within:z-20", isConfirmPasswordValid === false && confirmPassword.length > 0 && "z-10")}>
            <Input
              id="confirm-password"
              name="confirm-password"
              type="password"
              label={isConfirmPasswordValid === false ? "Passwords do not match *" : "Confirm Password *"}
              value={confirmPassword}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
              onChange={(e) => setConfirmPasswordValid(password === e.currentTarget.value)}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "rounded-t-none pr-12 duration-200 ease-kolumb-flow",
                isConfirmPasswordValid === false && "focus:shadow-focusError",
                isConfirmPasswordValid === false && confirmPassword.length > 0 && "shadow-borderError bg-red-100 focus:bg-white",
              )}
              labelClassName={cn(isConfirmPasswordValid === false && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center">
              <Button
                onClick={handleContinueToAgreement}
                variant={
                  isLoaded &&
                  isUsernameValid?.every((validation) => validation) &&
                  isEmailValid &&
                  isPasswordValid?.every((validation) => validation) &&
                  isConfirmPasswordValid
                    ? "unstyled"
                    : "disabled"
                }
                size="unstyled"
                className={cn(
                  "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-100 ease-in",
                  isLoaded &&
                    isUsernameValid?.every((validation) => validation) &&
                    isEmailValid &&
                    isPasswordValid?.every((validation) => validation) &&
                    isConfirmPasswordValid
                    ? "focus:shadow-focus"
                    : "cursor-default focus:shadow-focusError",
                )}
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
        className="absolute flex h-screen w-screen flex-col items-center justify-center overflow-auto"
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
        className="absolute flex h-screen w-screen flex-col items-center justify-center"
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
