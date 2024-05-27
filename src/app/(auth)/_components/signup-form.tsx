"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { signUpSchema } from "@/lib/validation/auth";
import { showErrorToast } from "@/lib/handle-error";

import Form from "./form";
import PasswordInput from "./password-input";
import SubmitButton from "./submit-button";
import OAuthSignIn from "./oauth-signin";
import { Input } from "@/components/input copy";
import Icons from "@/components/icons";
import { cn } from "@/lib/utils";

type Inputs = z.infer<typeof signUpSchema>;

export default function SignUpForm(props: { nextStage: () => void; disabled: boolean }) {
  const { isLoaded, signUp } = useSignUp();

  const [form, setForm] = useState<Inputs>({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const [firstName, lastName] = form.name.split(" ");

      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName,
        lastName,
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      props.nextStage();
      toast.message("Check your email", {
        description: "A 6-digit verification code has been sent.",
      });
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <OAuthSignIn />

      {/* Divider */}
      <div className="relative flex w-full items-center justify-center text-xs">
        <div
          id="divider"
          className={cn(
            "pointer-events-none absolute inset-x-0 h-px w-full select-none",
            "bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700",
          )}
        />
        <span className={cn("relative bg-white px-2 py-2 text-gray-500")}>OR CONTINUE WITH</span>
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="rounded-lg shadow-sm">
          <Input
            id="name"
            name="name"
            type="text"
            insetLabel="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            autoComplete="name"
            autoCorrect="off"
            spellCheck="false"
            className={{ input: " mb-px rounded-b-none" }}
          />

          <Input
            id="email"
            name="email"
            type="email"
            insetLabel="Email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="email"
            autoCorrect="off"
            spellCheck="false"
            className={{ input: "mb-px rounded-none" }}
          />

          <PasswordInput
            id="password"
            name="password"
            type="password"
            insetLabel="Password *"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="current-password"
            autoCorrect="off"
            spellCheck="false"
            className={{ input: "rounded-t-none" }}
          />
        </div>

        <SubmitButton loading={loading} disabled={props.disabled}>
          Continue
        </SubmitButton>
      </Form>

      <div className="flex flex-col items-center justify-center text-[13px] text-gray-500">
        <span>* Required Fields</span>

        <div>
          <span>Already have an account? </span>
          <Link href="/signin" className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline">
            Sign in here
            <Icons.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
          </Link>
        </div>
      </div>
    </>
  );
}
