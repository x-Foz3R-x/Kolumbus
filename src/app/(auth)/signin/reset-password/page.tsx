"use client";

import { useState } from "react";
import ResetPasswordConfirmForm from "../../_components/reset-password-confirm-form";
import ResetPasswordForm from "../../_components/reset-password-form";
import StageManager from "~/components/stage-manager";

export default function SignIn() {
  const [stage, setStage] = useState(0);

  return (
    <>
      <h1 className="text-2xl font-semibold">Reset password</h1>

      <StageManager
        stage={stage}
        stages={[
          {
            className: "space-y-4",
            children: (
              <>
                <p className="w-full pb-2 text-center">
                  Enter your email address to receive a verification code
                </p>
                <ResetPasswordForm setStage={setStage} />
              </>
            ),
          },
          {
            prevStageHeight: 176,
            className: "space-y-4",
            children: (
              <>
                <ResetPasswordConfirmForm setStage={setStage} />
              </>
            ),
          },
        ]}
        style={{ marginTop: "0" }}
        className="pb-1"
      />

      <div>
        <button onClick={() => setStage(0)}>Back</button>
        <button onClick={() => setStage(1)}>Next</button>
      </div>
    </>
  );
}
