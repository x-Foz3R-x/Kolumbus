"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/context/auth";
import { auth } from "@/lib/firebase";

import { Submit, FormSeparator } from "@/components/form/Form";
import Checkbox from "@/components/ui/checkbox/checkbox";

import "@/components/form/input.css";

export default function SignUp() {
  const { signin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRememberChecked, setIsRememberChecked] = useState(false);

  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await signin(email, password, isRememberChecked);
      router.push("/itinerary");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1 className="my-6 text-2xl font-medium">Sign in to Kolumbus</h1>
      <form action="" className="relative flex flex-col">
        <input
          value={email}
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
          type="email"
          name="email"
          autoComplete="email"
          autoCorrect="off"
          spellCheck="false"
          placeholder="E-mail"
          className="input input-top"
        />

        <input
          value={password}
          onChange={(e: any) => {
            setPassword(e.target.value);
          }}
          type="password"
          name="password"
          autoComplete="current-password"
          autoCorrect="off"
          spellCheck="false"
          placeholder="Password"
          className="input input-bot with-button"
        />

        <Checkbox
          isChecked={isRememberChecked}
          setIsChecked={setIsRememberChecked}
        >
          Remember me
        </Checkbox>

        {/* bottom position = (48px input height - 28px button height) / 2 = 10px = 0.625rem */}
        <Submit
          handleClick={handleSubmit}
          isEnabled={false}
          className="bottom-14 right-2"
        />
      </form>

      <FormSeparator />

      <div className="flex flex-col items-center justify-center text-xs">
        <Link href="/">Forgot password?</Link>

        <div>
          <span>Don't have an account? </span>
          <Link href="/signup">Create yours now.</Link>
        </div>
      </div>
    </>
  );
}
