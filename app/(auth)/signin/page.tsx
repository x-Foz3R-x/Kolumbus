"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/auth";

import { Submit, AuthProviders, FormSeparator } from "@/components/form/Form";
import Checkbox from "@/components/ui/checkbox/checkbox";

import "@/components/form/input.css";

export default function SignUp() {
  const { signin } = useAuth();

  const initialFormState = {
    email: "",
    password: "",
    isChecked: false,
    error: "",
  };

  const [form, setForm] = useState(initialFormState);

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signin(form.email, form.password, form.isChecked);
      router.push("/itinerary");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="my-6 text-2xl font-medium">Sign in to Kolumbus</h1>
      {form.error && (
        <div className="mb-2 rounded-md bg-red-100 px-4 py-1 text-red-600">
          {form.error}
        </div>
      )}
      <form className="relative flex flex-col">
        <input
          value={form.email}
          onChange={(e: any) => {
            setForm({
              ...form,
              ["email"]: e.target.value,
            });
          }}
          type="email"
          id="email"
          name="email"
          autoComplete="email"
          autoCorrect="off"
          spellCheck="false"
          placeholder="E-mail"
          className="input input-top"
        />

        <input
          value={form.password}
          onChange={(e: any) => {
            setForm({
              ...form,
              ["password"]: e.target.value,
            });
          }}
          type="password"
          id="password"
          name="password"
          autoComplete="current-password"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Password"
          className="input input-bot with-button"
        />

        <Checkbox
          formObject={form}
          setFormObject={setForm}
          formKey={"isChecked"}
        >
          Remember me
        </Checkbox>

        <Submit
          handleClick={handleSubmit}
          isEnabled={false}
          className="bottom-14 right-2"
        />
      </form>

      <FormSeparator />
      <AuthProviders />
      <FormSeparator />

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
