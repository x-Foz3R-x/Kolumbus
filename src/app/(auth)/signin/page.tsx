import Link from "next/link";

import { Divider, Icons } from "~/components/ui";
import OAuthSignIn from "../_components/oauth-signin";
import SignInForm from "../_components/signin-form";

export default function SignIn() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Sign in to Kolumbus</h1>

      <OAuthSignIn />

      <Divider label="OR CONTINUE WITH" gradient className={{ label: "py-2 text-gray-500" }} />

      <SignInForm />

      <div className="flex flex-col items-center justify-center text-[13px] text-gray-500">
        <Link
          href="/signin/reset-password"
          className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline"
        >
          Forgot password?
        </Link>

        <div>
          <span>Don’t have an account? </span>
          <Link
            href="/signup"
            className="text-kolumblue-600 decoration-kolumblue-500 hover:underline focus-visible:underline"
          >
            Create yours now
            <Icons.chevronLight className="mb-0.5 ml-0.5 inline h-1 -rotate-90 fill-kolumblue-600" />
          </Link>
        </div>
      </div>
    </>
  );
}
