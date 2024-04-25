"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { resetPasswordSchema } from "~/lib/validations/auth";
import { showErrorToast } from "~/lib/handle-error";
import { Button, Input } from "~/components/ui";
import SubmitButton from "./submit-button";
import PasswordInput from "./password-input";

type Inputs = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordConfirmForm(props: {
  prevStage: () => void;
  disabled: boolean;
}) {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [form, setForm] = useState<Inputs>({ code: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (!isLoaded) return;

    setLoading(true);

    try {
      const attemptFirstFactor = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: form.code,
        password: form.password,
      });

      if (attemptFirstFactor.status === "needs_second_factor") {
        // TODO: implement 2FA (requires clerk pro plan)
      } else if (attemptFirstFactor.status === "complete") {
        await setActive({ session: attemptFirstFactor.createdSessionId });
        router.push(`${window.location.origin}/`);
        toast.success("Password reset successfully.");
      } else {
        console.error(attemptFirstFactor);
      }
    } catch (error) {
      showErrorToast(error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full space-y-4">
      <div className="pb-4 pt-3 text-center text-sm text-gray-500">
        <span className="block pb-1.5">Enter the 6-digit code sent to your email</span>
        <Input
          type="one-time-code"
          length={6}
          value={form.code}
          onChange={(code) => setForm({ ...form, code })}
          className={{ container: "mx-auto w-fit" }}
        />
      </div>

      <div className="rounded-lg shadow-sm">
        <PasswordInput
          id="password"
          name="password"
          type="password"
          insetLabel="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck="false"
          className={{ input: "mb-px rounded-b-none" }}
        />
        <PasswordInput
          id="confirm-password"
          name="confirm-password"
          type="password"
          insetLabel="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck="false"
          className={{ input: "rounded-t-none" }}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => props.prevStage()}
          variant="appear"
          className="flex h-10 w-full items-center justify-center border bg-white/50 font-medium shadow-sm hover:bg-gray-100"
          disabled={props.disabled}
        >
          Go back
        </Button>
        <SubmitButton onSubmit={onSubmit} loading={loading} disabled={props.disabled}>
          Reset Password
        </SubmitButton>
      </div>
    </form>
  );
}
