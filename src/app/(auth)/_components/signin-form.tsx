"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { toast } from "sonner";
import type { z } from "zod";

import type { authSchema } from "~/lib/validation/auth";
import { showErrorToast } from "~/lib/handle-error";
import { Button, Input, Spinner } from "~/components/ui";

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
          label="Email"
          value={form.email}
          onInput={(e) => setForm({ ...form, email: e.currentTarget.value })}
          autoComplete="email"
          autoCorrect="off"
          spellCheck="false"
          variant="insetLabel"
          className="detectAutofill mb-px rounded-b-none"
        />

        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          value={form.password}
          onInput={(e) => setForm({ ...form, password: e.currentTarget.value })}
          autoComplete="current-password"
          autoCorrect="off"
          spellCheck="false"
          variant="insetLabel"
          className="detectAutofill rounded-t-none"
        />
      </div>

      <Button
        type="submit"
        onClick={onSubmit}
        variant={isLoaded ? "appear" : "disabled"}
        size="lg"
        className="flex h-10 w-full items-center justify-center rounded-lg bg-gray-800 font-medium text-white shadow-sm hover:bg-gray-700"
      >
        {loading ? <Spinner.default className="fill-white" /> : "Sign in"}
      </Button>
    </form>
  );
}
