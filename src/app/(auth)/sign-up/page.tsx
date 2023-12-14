"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/nextjs";

import api from "@/app/_trpc/client";
import { IsEmail, ValidatePassword, ValidateUsername } from "@/lib/validation";
import { cn } from "@/lib/utils";

import Icon from "@/components/icons";
import { Button, Divider, Input } from "@/components/ui";
import { TooltipTrigger } from "@/components/ui/tooltip";

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signOut } = useClerk();
  const router = useRouter();

  const findUsername = api.clerk.findUsername.useMutation();

  const [agreement, setAgreement] = useState(false);
  const [verification, setVerification] = useState(false);
  const [code, setCode] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isValid, setValid] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState<
    { available?: boolean; length: boolean; characters: boolean; allowed: boolean } | undefined
  >();
  const [emailValidation, setEmailValidation] = useState<{ isEmail: boolean } | undefined>();
  const [passwordValidation, setPasswordValidation] = useState<
    { length: boolean; lowerCase: boolean; upperCase: boolean; numberOrSymbol: boolean } | undefined
  >();
  const [isConfirmPasswordValid, setConfirmPasswordValid] = useState<boolean>();

  const isUsernameValid = usernameValidation && Object.values(usernameValidation).every((value, index) => (index === 0 && true) || value);
  const isPasswordValid = passwordValidation && Object.values(passwordValidation).every((value) => value);

  useEffect(() => {
    setValid(isUsernameValid && emailValidation?.isEmail && isPasswordValid && password === confirmPassword ? true : false);
  }, [isUsernameValid, emailValidation, isPasswordValid, password, confirmPassword]);

  const handleContinueToAgreement = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    // setUsernameValidation({ available: true, ...ValidateUsername(e.currentTarget.value) });
    // setEmailValid(IsEmail(email));
    // setPasswordValid(ValidatePassword(password));
    // setConfirmPasswordValid(password === confirmPassword);

    if (isLoaded && isValid) setAgreement(true);
  };
  const handleCancel = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    setValid(false);
    setUsernameValidation(undefined);
    setEmailValidation(undefined);
    setPasswordValidation(undefined);
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
      await signUp.create({ emailAddress: email, password, username, firstName: username });

      // Send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Move to verification section.
      setAgreement(false);
      setVerification(true);
    } catch (error: unknown) {
      console.error(error);
      handleCancel();
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

  const getUsernameLabel = () => {
    if (username.length === 0 || !isUsernameValid) return "Username *";
    if (usernameValidation?.available === false) return "Username is already taken";
    if (!usernameValidation?.length) return "At least 5 characters in length";
    if (!usernameValidation?.characters) return "Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)";
    if (!usernameValidation?.allowed) return "Username is not allowed";
    return "Username *";
  };
  const getPasswordLabel = () => {
    if (!passwordValidation || password.length === 0 || !isPasswordValid) return "Password *";
    if (!passwordValidation.length) return "At least 8 characters in length";
    if (!passwordValidation.lowerCase) return "Should contain lower case letters (a-z)";
    if (!passwordValidation.upperCase) return "Should contain upper case letters (A-Z)";
    if (!passwordValidation.numberOrSymbol) return "Should contain numbers (0-9) or symbols";
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
          <div className={cn("relative focus-within:z-20", isUsernameValid === false && username.length > 0 && "z-10")}>
            <Input
              id="username"
              name="username"
              type="text"
              label={getUsernameLabel()}
              value={username}
              onInput={(e) => setUsername(e.currentTarget.value)}
              onChange={async (e) => {
                setUsernameValidation({ available: undefined, ...ValidateUsername(e.target.value) });
                if (e.target.value.length < 5) return;
                findUsername.mutate(e.target.value, {
                  onSuccess: (data) => setUsernameValidation({ available: data.length === 0, ...ValidateUsername(e.target.value) }),
                });
              }}
              autoComplete="username"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-b-none duration-200 ease-kolumb-flow",
                isUsernameValid === false && "focus:shadow-focusError",
                isUsernameValid === false && username.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
              )}
              labelClassName={isUsernameValid === false || usernameValidation?.available === false ? "text-red-500" : ""}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <SignUpTooltipTrigger validation={usernameValidation}>
                <SignUpTooltipCheck validation={usernameValidation?.available}>Available</SignUpTooltipCheck>
                <SignUpTooltipCheck validation={usernameValidation?.length}>At least 5 characters in length</SignUpTooltipCheck>
                <SignUpTooltipCheck validation={usernameValidation?.characters}>
                  Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)
                </SignUpTooltipCheck>

                <Divider gradient className="my-1 via-gray-600" />

                <p>Ride smoothly through the digital highways with an adventurous username!</p>
              </SignUpTooltipTrigger>
            </span>
          </div>

          <div className={cn("relative focus-within:z-20", emailValidation?.isEmail === false && email.length > 0 && "z-10")}>
            <Input
              id="email"
              name="email"
              type="email"
              label={emailValidation?.isEmail === false && email.length > 0 ? "Invalid email *" : "Email *"}
              value={email}
              onInput={(e) => setEmail(e.currentTarget.value)}
              onChange={(e) => setEmailValidation({ isEmail: IsEmail(e.target.value) })}
              autoComplete="email"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-none duration-200 ease-kolumb-flow",
                emailValidation?.isEmail === false && "focus:shadow-focusError",
                emailValidation?.isEmail === false && email.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
              )}
              labelClassName={cn(emailValidation?.isEmail === false && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <SignUpTooltipTrigger validation={emailValidation}>
                <SignUpTooltipCheck validation={emailValidation?.isEmail}>name@example.com</SignUpTooltipCheck>
                <Divider gradient className="my-1 via-gray-600" />
                <p>Sail smoothly into our inbox with joyous emails from new users!</p>
              </SignUpTooltipTrigger>
            </span>
          </div>

          <div className={cn("relative focus-within:z-20", isPasswordValid === false && password.length > 0 && "z-10")}>
            <Input
              id="password"
              name="password"
              type="password"
              label={getPasswordLabel()}
              value={password}
              onInput={(e) => setPassword(e.currentTarget.value)}
              onChange={(e) => setPasswordValidation({ ...ValidatePassword(e.target.value) })}
              autoComplete="new-password"
              autoCorrect="off"
              spellCheck="false"
              variant="insetLabel"
              className={cn(
                "mb-px rounded-none pr-12 duration-200 ease-kolumb-flow",
                isPasswordValid === false && "focus:shadow-focusError",
                isPasswordValid === false && password.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
              )}
              labelClassName={isPasswordValid === false ? "text-red-500" : ""}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
              <SignUpTooltipTrigger validation={passwordValidation}>
                <SignUpTooltipCheck validation={passwordValidation?.length}>At least 8 characters in length</SignUpTooltipCheck>
                <SignUpTooltipCheck
                  validation={passwordValidation?.lowerCase && passwordValidation?.upperCase && passwordValidation?.numberOrSymbol}
                >
                  Should contain:
                </SignUpTooltipCheck>
                <div className="flex flex-col gap-1 pl-4.5">
                  <SignUpTooltipCheck
                    validation={passwordValidation?.lowerCase === false || passwordValidation?.lowerCase === undefined ? undefined : true}
                  >
                    Lower case letters (a-z)
                  </SignUpTooltipCheck>
                  <SignUpTooltipCheck
                    validation={passwordValidation?.upperCase === false || passwordValidation?.upperCase === undefined ? undefined : true}
                  >
                    Upper case letters (A-Z)
                  </SignUpTooltipCheck>
                  <SignUpTooltipCheck
                    validation={
                      passwordValidation?.numberOrSymbol === false || passwordValidation?.numberOrSymbol === undefined ? undefined : true
                    }
                  >
                    Numbers (0-9) or symbols
                  </SignUpTooltipCheck>
                </div>

                <Divider gradient className="my-1 via-gray-600" />

                <p>Fly smoothly through our security gates with a password that soars securely!</p>
              </SignUpTooltipTrigger>
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
                isConfirmPasswordValid === false && confirmPassword.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
              )}
              labelClassName={cn(isConfirmPasswordValid === false && "text-red-500")}
            />

            <span className="absolute inset-y-0 right-4 z-30 flex items-center">
              <Button
                onClick={handleContinueToAgreement}
                variant={isLoaded && isValid ? "unstyled" : "disabled"}
                size="unstyled"
                className={cn(
                  "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-100 ease-in",
                  isLoaded && isValid ? "focus:shadow-focus" : "cursor-default focus:shadow-focusError",
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

function SignUpTooltipTrigger({ validation, children }: { validation: {} | undefined; children: React.ReactNode }) {
  const getIcon = (isValid: boolean | undefined) => {
    if (typeof isValid === "undefined") return <Icon.circleQuestionMark className="h-4 w-4 rounded-full fill-kolumblue-500 shadow-soft" />;
    else if (isValid) return <Icon.circleCheck className="h-4 w-4 rounded-full fill-green-500 shadow-soft" />;
    else return <Icon.circleExclamation className="h-4 w-4 rounded-full fill-red-500 shadow-soft" />;
  };

  return (
    <TooltipTrigger
      placement="right"
      arrow={{ size: 15 }}
      className="flex w-60 flex-col gap-1.5 px-5 py-3 text-xs"
      buttonProps={{
        variant: "unstyled",
        size: "unstyled",
        children: getIcon(typeof validation === "undefined" ? undefined : Object.values(validation).every((value) => value)),
      }}
    >
      {children}
    </TooltipTrigger>
  );
}

function SignUpTooltipCheck({ validation, children }: { validation: boolean | undefined; children: React.ReactNode }) {
  const getText = (isValid?: boolean) => {
    if (typeof isValid === "undefined") return "text-gray-400";
    else if (isValid) return "text-green-400/70";
    else return "text-red-400/80";
  };
  const getBackground = (isValid?: boolean) => {
    if (typeof isValid === "undefined") return "bg-gray-400";
    else if (isValid) return "bg-green-500/90";
    else return "bg-red-500/90";
  };

  return (
    <div className={`flex gap-2 ${getText(validation)}`}>
      <span role="presentation" className={`mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full shadow-soft ${getBackground(validation)}`} />
      {children}
    </div>
  );
}
