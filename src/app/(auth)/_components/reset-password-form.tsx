"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { checkEmailSchema } from "~/lib/validations/auth";
import { showErrorToast } from "~/lib/handle-error";

import Form from "./form";
import SubmitButton from "./submit-button";
import { Input } from "~/components/ui";

type Inputs = z.infer<typeof checkEmailSchema>;

export default function ResetPasswordForm(props: { nextStage: () => void; disabled: boolean }) {
  const { isLoaded, signIn } = useSignIn();

  const [form, setForm] = useState<Inputs>({ email: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const firstFactor = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: form.email,
      });

      if (firstFactor.status === "needs_first_factor") {
        props.nextStage();
        toast.message("Check your email", {
          description: "A 6-digit verification code has been sent.",
        });
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="w-full pb-2 text-center text-gray-600">
        Enter your email address to receive a <br /> verification code
      </p>

      <Form onSubmit={onSubmit}>
        <Input
          id="email"
          name="email"
          type="email"
          insetLabel="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          autoComplete="email"
          autoCorrect="off"
          spellCheck="false"
          className={{ container: "rounded-lg shadow-sm" }}
        />

        <SubmitButton loading={loading} disabled={props.disabled}>
          Continue
        </SubmitButton>
      </Form>
    </>
  );
}
