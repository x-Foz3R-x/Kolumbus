"use client";

import StageManager from "~/components/stage-manager";
import SignUpForm from "../_components/signup-form";
import VerifyEmailForm from "../_components/verify-email-form";

export default function SignUp() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Create your account</h1>

      <StageManager
        stages={[
          {
            className: "space-y-4 [&>:first-child]:pt-3",
            children: ({ nextStage, disabled }) => (
              <SignUpForm nextStage={nextStage} disabled={disabled} />
            ),
          },
          {
            prevStageHeight: 361,
            children: () => <VerifyEmailForm />,
          },
        ]}
        // debug
        style={{ marginTop: "4px" }}
      />
    </>
  );
}
