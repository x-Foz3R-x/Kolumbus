"use client";

import { useState } from "react";
import Link from "next/link";

import Icon from "@/components/icons";
import SigninForm from "@/components/form/signin-form";
import AuthProviders from "@/components/auth-providers";

import "@/components/form/input.css";

export default function SignUp() {
  const initialFormState = {
    email: "",
    password: "",
    isChecked: false,
    error: "",
  };

  const [form, setForm] = useState(initialFormState);

  return (
    <>
      <h1 className="my-6 text-2xl font-medium">Sign in to Kolumbus</h1>

      {form.error && (
        <div className="mb-2 rounded-md bg-red-100 px-4 py-1 text-red-600">
          {form.error}
        </div>
      )}

      <SigninForm />

      <Icon.separator className="my-6 h-px scale-x-[3.2]" />

      <AuthProviders />

      <Icon.separator className="my-6 h-px scale-x-[3.2]" />

      <div className="flex flex-col items-center justify-center text-xs">
        <Link href="/">Forgot password?</Link>

        <div>
          <span>Don&apos;t have an account? </span>
          <Link href="/signup">Create yours now.</Link>
        </div>
      </div>
    </>
  );
}
