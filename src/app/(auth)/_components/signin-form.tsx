"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { authSchema } from "~/lib/validations/auth";
import { showErrorToast } from "~/lib/handle-error";

import Form from "./form";
import PasswordInput from "./password-input";
import SubmitButton from "./submit-button";
import { Input } from "~/components/ui";

type Inputs = z.infer<typeof authSchema>;

export default function SignInForm() {
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const [form, setForm] = useState<Inputs>({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.create({ identifier: form.email, password: form.password });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });

        router.push("/library");
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
    <Form onSubmit={onSubmit}>
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
          className={{ input: "mb-px rounded-b-none" }}
        />

        <PasswordInput
          id="password"
          name="password"
          type="password"
          insetLabel="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          autoComplete="current-password"
          autoCorrect="off"
          spellCheck="false"
          className={{ input: "rounded-t-none" }}
        />
      </div>

      <SubmitButton loading={loading}>Sign in</SubmitButton>
    </Form>
  );
}
