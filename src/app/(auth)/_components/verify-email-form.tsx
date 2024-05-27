"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSignUp } from "@clerk/nextjs";
import type { z } from "zod";

import type { verifyEmailSchema } from "@/lib/validation/auth";
import { showErrorToast } from "@/lib/handle-error";

import Form from "./form";
import SubmitButton from "./submit-button";
import { Input } from "@/components/input copy";

type Inputs = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmailForm() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [form, setForm] = useState<Inputs>({ code: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({ code: form.code });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });

        router.push("/library");
      }
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
             or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <div className="pb-2 pt-2.5 text-center text-sm text-gray-500">
        <span className="block pb-1.5">Enter the 6-digit code sent to your email</span>
        <Input
          type="one-time-code"
          length={6}
          value={form.code}
          onChange={(code) => setForm({ code })}
          onComplete={onSubmit}
          className={{ container: "mx-auto w-fit" }}
        />
      </div>

      <div className="space-y-4 px-2 pb-2 *:text-[13px] *:text-gray-500">
        <p>
          By clicking “Create Account”, you acknowledge our{" "}
          <Link href="/terms" className="font-medium text-kolumblue-500 underline-offset-1 hover:underline">
            Terms of Service
          </Link>
          {" and "}
          <Link href="/privacy" className="font-medium text-kolumblue-500 underline-offset-1 hover:underline">
            Privacy Policy
          </Link>
          . These outline our guidelines, protective measures, and your information’s confidentiality.
        </p>
      </div>

      <SubmitButton loading={loading}>Create Account</SubmitButton>
    </Form>
  );
}
