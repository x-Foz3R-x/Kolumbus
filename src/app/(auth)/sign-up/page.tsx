"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useClerk } from "@clerk/clerk-react";
import { useSignUp } from "@clerk/nextjs";

import { IsEmail, ValidatePassword, ValidateName } from "@/lib/validation";
import { cn } from "@/lib/utils";

import Icon from "@/components/icons";
import { Button, Divider, Input } from "@/components/ui";
import EmailVerification from "@/components/layouts/email-verification";

//#region Context
const SignUpContext = createContext<{
  section: "form" | "agreement" | "verification";
  setSection: React.Dispatch<React.SetStateAction<"form" | "agreement" | "verification">>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;

  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  isValid: boolean;
  setValid: React.Dispatch<React.SetStateAction<boolean>>;

  reset: () => void;
} | null>(null);
function useSignUpContext() {
  const context = useContext(SignUpContext);
  if (!context) throw new Error("useSignUpContext must be used within a useSignUpContext.Provider");
  return context;
}
//#endregion

export default function SignUp() {
  const [section, setSection] = useState<"form" | "agreement" | "verification">("form");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isValid, setValid] = useState(false);

  const reset = () => {
    setSection("form");

    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setValid(false);
  };

  const value = {
    section,
    setSection,
    error,
    setError,

    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isValid,
    setValid,

    reset,
  };

  return (
    <SignUpContext.Provider value={value}>
      <FormSection />
      <AgreementSection />
      <VerificationSection />
    </SignUpContext.Provider>
  );
}

function FormSection() {
  const {
    section,
    setSection,
    error,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isValid,
    setValid,
  } = useSignUpContext();

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [nameValidation, setNameValidation] = useState<{ length: boolean; characters: boolean; allowed: boolean } | undefined>();
  const [emailValidation, setEmailValidation] = useState<{ isEmail: boolean } | undefined>();
  const [passwordValidation, setPasswordValidation] = useState<
    { length: boolean; lowerCase: boolean; upperCase: boolean; numberOrSymbol: boolean } | undefined
  >();
  const [isConfirmPasswordValid, setConfirmPasswordValidation] = useState<boolean>();

  const isNameValid = nameValidation && Object.values(nameValidation).every((value) => value);
  const isPasswordValid = passwordValidation && Object.values(passwordValidation).every((value) => value);

  useEffect(() => {
    setValid(isNameValid && emailValidation?.isEmail && isPasswordValid && password === confirmPassword ? true : false);
  }, [setValid, isNameValid, emailValidation, isPasswordValid, password, confirmPassword]);

  // OnAutofill validation.
  useEffect(() => {
    const handleAutofill = (e: AnimationEvent) => {
      if (e.animationName !== "autofillStart") return;

      if (nameRef.current && e.target === nameRef.current) setNameValidation(ValidateName(nameRef.current.value));
      if (emailRef.current && e.target === emailRef.current) setEmailValidation({ isEmail: IsEmail(emailRef.current.value) });
      if (passwordRef.current && e.target === passwordRef.current) setPasswordValidation(ValidatePassword(passwordRef.current.value));
      if (passwordRef.current && confirmPasswordRef.current && e.target === confirmPasswordRef.current)
        setConfirmPasswordValidation(confirmPasswordRef.current.value === passwordRef.current.value);
    };

    document.addEventListener("animationstart", handleAutofill, true);
    return () => document.removeEventListener("animationstart", handleAutofill, true);
  }, []);

  const handleContinue = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    setNameValidation(ValidateName(name));
    setEmailValidation({ isEmail: IsEmail(email) });
    setPasswordValidation(ValidatePassword(password));
    setConfirmPasswordValidation(password === confirmPassword);

    // If all fields are valid, move to agreement section.
    if (isValid) setSection("agreement");
  };

  const getNameLabel = () => {
    if (name.length === 0) return "Name *";
    if (nameValidation?.length === false) return "At least 3 characters in length";
    if (nameValidation?.characters === false) return "Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)";
    if (nameValidation?.allowed === false) return "This name is not allowed";
    return "Name *";
  };
  const getPasswordLabel = () => {
    if (password.length === 0) return "Password *";
    if (passwordValidation?.length === false) return "At least 8 characters in length";
    if (passwordValidation?.lowerCase === false) return "Should contain lower case letters (a-z)";
    if (passwordValidation?.upperCase === false) return "Should contain upper case letters (A-Z)";
    if (passwordValidation?.numberOrSymbol === false) return "Should contain numbers (0-9) or symbols";
    return "Password *";
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={{
        y: section === "form" ? 0 : "-25%",
        scale: section === "form" ? 1 : 0,
        opacity: section === "form" ? 1 : 0,
        transition: { duration: 1, ease: "anticipate" },
      }}
      className="absolute flex h-screen w-screen flex-col items-center justify-center"
    >
      <Link href="/">
        <Icon.logo className="h-6" />
      </Link>
      <h1 className="my-4 pb-1 text-2xl font-medium text-gray-800">Create your account</h1>

      {error && <span className="mx-auto mb-4 rounded-md bg-red-100 px-2 py-0.5 text-red-500">{error}</span>}

      <form className="relative flex w-[22rem] flex-col rounded-lg shadow-soft">
        <div className={cn("relative focus-within:z-20", isNameValid === false && name.length > 0 && "z-10")}>
          <Input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            label={getNameLabel()}
            value={name}
            onInput={(e) => setName(e.currentTarget.value)}
            onChange={(e) => setNameValidation(ValidateName(e.target.value))}
            autoComplete="name"
            autoCorrect="off"
            spellCheck="false"
            variant="insetLabel"
            className={cn(
              "detectAutofill mb-px rounded-b-none pr-12 duration-200 ease-kolumb-flow",
              isNameValid === false && "focus:shadow-focusError",
              isNameValid === false && name.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
            )}
            labelClassName={isNameValid === false ? "text-red-500" : ""}
          />

          <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
            <SignUpTooltipTrigger validation={nameValidation}>
              <SignUpTooltipCheck validation={nameValidation?.length}>At least 3 characters in length</SignUpTooltipCheck>
              <SignUpTooltipCheck validation={nameValidation?.characters}>
                Using only letters (a-z), numbers (0-9) with underscores (_) and dashes (-)
              </SignUpTooltipCheck>

              <Divider gradient className="my-1 via-gray-600" />

              <div className="relative text-center">
                Examples
                <div className="flex justify-between pt-1.5">
                  <ul className="w-full text-green-300/70">
                    <li>John Doe</li>
                    <li>name123</li>
                    <li>nick_name-123</li>
                  </ul>

                  <ul className="w-full text-red-300/70">
                    <li>John D Doe</li>
                    <li>name!@#</li>
                    <li>nick__name--123</li>
                  </ul>
                </div>
              </div>
            </SignUpTooltipTrigger>
          </span>
        </div>

        <div className={cn("relative focus-within:z-20", emailValidation?.isEmail === false && email.length > 0 && "z-10")}>
          <Input
            ref={emailRef}
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
              "detectAutofill mb-px rounded-none pr-12 duration-200 ease-kolumb-flow",
              emailValidation?.isEmail === false && "focus:shadow-focusError",
              emailValidation?.isEmail === false && email.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
            )}
            labelClassName={cn(emailValidation?.isEmail === false && "text-red-500")}
          />

          <span className="absolute inset-y-0 right-4 z-30 flex w-7 items-center justify-center">
            <SignUpTooltipTrigger validation={emailValidation}>
              <SignUpTooltipCheck validation={emailValidation?.isEmail}>name@example.com</SignUpTooltipCheck>
            </SignUpTooltipTrigger>
          </span>
        </div>

        <div className={cn("relative focus-within:z-20", isPasswordValid === false && password.length > 0 && "z-10")}>
          <Input
            ref={passwordRef}
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
              "detectAutofill mb-px rounded-none pr-12 duration-200 ease-kolumb-flow",
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
            </SignUpTooltipTrigger>
          </span>
        </div>

        <div className={cn("relative focus-within:z-20", isConfirmPasswordValid === false && confirmPassword.length > 0 && "z-10")}>
          <Input
            ref={confirmPasswordRef}
            id="confirm-password"
            name="confirm-password"
            type="password"
            label={isConfirmPasswordValid === false ? "Passwords do not match *" : "Confirm Password *"}
            value={confirmPassword}
            onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            onChange={(e) => setConfirmPasswordValidation(password === e.currentTarget.value)}
            autoComplete="new-password"
            autoCorrect="off"
            spellCheck="false"
            variant="insetLabel"
            className={cn(
              "detectAutofill rounded-t-none pr-12 duration-200 ease-kolumb-flow",
              isConfirmPasswordValid === false && "focus:shadow-focusError",
              isConfirmPasswordValid === false && confirmPassword.length > 0 && "bg-red-100 shadow-borderError focus:bg-white",
            )}
            labelClassName={cn(isConfirmPasswordValid === false && "text-red-500")}
          />

          <span className="absolute inset-y-0 right-4 z-30 flex items-center">
            <Button
              onClick={handleContinue}
              variant={isValid ? "unset" : "disabled"}
              size="unset"
              className={cn(
                "pointer-events-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-700 shadow-soft duration-100 ease-in",
                isValid ? "focus:shadow-focus" : "cursor-default focus:shadow-focusError",
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
  );
}
function AgreementSection() {
  const { section, setSection, setError, name, email, password, reset } = useSignUpContext();
  const { signUp, isLoaded } = useSignUp();
  const { signOut } = useClerk();

  const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!isLoaded) return;
    signOut();

    const [firstName, lastName] = name.split(" ");
    try {
      // Create the user.
      await signUp.create({ emailAddress: email, password, firstName, lastName });

      // Send the email.
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Move to verification section.
      setSection("verification");
    } catch (error: unknown) {
      console.error(error);

      if ((error as { errors?: { message: string }[] })?.errors && (error as { errors: { message: string }[] }).errors.length > 0) {
        setError((error as { errors: { message: string }[] }).errors[0].message);
      } else setError("An error occurred.");

      reset();
    }
  };

  return (
    <motion.div
      initial={{ y: "25%", scale: 0, opacity: 0 }}
      animate={{
        y: section === "agreement" ? 0 : "25%",
        scale: section === "agreement" ? 1 : 0,
        opacity: section === "agreement" ? 1 : 0,
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

        <div className="flex justify-between gap-4 font-medium">
          <span className="h-10">
            <Button onClick={reset} variant="button" className="border-gray-200 bg-gray-100 px-3 py-2 text-gray-500" disabled={!isLoaded}>
              Cancel
            </Button>
          </span>

          <span className="h-10">
            <Button
              onClick={handleSignUp}
              variant="button"
              className="border-kolumblue-600 bg-kolumblue-500 px-5 py-2 text-white"
              disabled={!isLoaded}
            >
              I agree
            </Button>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
function VerificationSection() {
  const { section, reset } = useSignUpContext();

  return (
    <motion.div
      initial={{ y: "25%", scale: 0, opacity: 0 }}
      animate={{
        y: section === "verification" ? 0 : "25%",
        scale: section === "verification" ? 1 : 0,
        opacity: section === "verification" ? 1 : 0,
        transition: { duration: 1, ease: "anticipate" },
      }}
      className="absolute h-screen w-screen "
    >
      <EmailVerification reset={reset} />
    </motion.div>
  );
}

function SignUpTooltipTrigger({ validation, children }: { validation: {} | undefined; children?: React.ReactNode }) {
  const getIcon = (isValid: boolean | undefined) => {
    if (typeof isValid === "undefined") return <Icon.circleQuestionMark className="h-4 w-4 rounded-full fill-kolumblue-500 shadow-soft" />;
    else if (isValid) return <Icon.circleCheck className="h-4 w-4 rounded-full fill-green-500 shadow-soft" />;
    else return <Icon.circleExclamation className="h-4 w-4 rounded-full fill-red-500 shadow-soft" />;
  };

  return (
    <Button
      variant="unset"
      size="unset"
      tooltip={{
        placement: "right",
        animation: "fadeToPosition",
        zIndex: 30,
        className: "flex origin-left w-60 flex-col gap-1.5 px-5 py-3 text-xs font-inter",
        children,
      }}
    >
      {getIcon(typeof validation === "undefined" ? undefined : Object.values(validation).every((value) => value))}
    </Button>
  );
}
function SignUpTooltipCheck({ validation, children }: { validation: boolean | undefined; children?: React.ReactNode }) {
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
