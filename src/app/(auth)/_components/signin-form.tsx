"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { authSchema } from "~/lib/validations/auth";
import { showErrorToast } from "~/lib/handle-error";
import { Input } from "~/components/ui";
import SubmitButton from "./submit-button";

type Inputs = z.infer<typeof authSchema>;

export default function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [form, setForm] = useState<Inputs>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();

    if (!isLoaded) return;

    setLoading(true);

    try {
      const result = await signIn.create({ identifier: form.email, password: form.password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        router.push(`${window.location.origin}/`);
      } else {
        toast.info(result.status);
        /*Investigate why the login hasn't completed */
        console.log(result.status);
      }
    } catch (error) {
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="w-full space-y-4">
      <div className="rounded-lg shadow-sm">
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
          className={{ input: "detectAutofill mb-px rounded-b-none" }}
        />

        <Input
          id="password"
          name="password"
          type="password"
          insetLabel="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
          autoCorrect="off"
          spellCheck="false"
          className={{ input: "detectAutofill rounded-t-none" }}
        />
      </div>

      <SubmitButton onSubmit={onSubmit} loading={loading}>
        Sign in
      </SubmitButton>
    </form>
  );
}
