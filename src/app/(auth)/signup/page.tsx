"use client";

import { useState } from "react";
import Link from "next/link";

import Icon from "@/components/icons";
import SignupForm from "@/components/form/signup-form";

import "@/components/form/input.css";

export default function SignUp() {
  const initialFormState = {
    username: "",
    country: "USA",
    sex: "M",
    email: "",
    password: "",
    confirmPassword: "",
    isChecked: false,
    error: "",
  };

  const [form, setForm] = useState(initialFormState);

  return (
    <>
      <h1 className="py-6 text-2xl font-medium">Create your account</h1>

      {form.error && <div className="mb-2 rounded-md bg-red-100 px-4 py-1 text-red-600">{form.error}</div>}

      <SignupForm />

      <Icon.separator className="my-6 h-px scale-x-[3.2]" />

      <div className="flex flex-col items-center justify-center text-xs">
        <div>* Required Fields</div>

        <div>
          <span>Already have an account? </span>
          <Link href="/signin">Sign in here.</Link>
        </div>
      </div>
    </>
  );
}
