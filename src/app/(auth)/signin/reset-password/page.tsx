"use client";

import StageManager from "~/components/stage-manager";
import ResetPasswordForm from "../../_components/reset-password-form";
import ResetPasswordConfirmForm from "../../_components/reset-password-confirm-form";

export default function SignIn() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Reset password</h1>

      <StageManager
        stages={[
          {
            className: "space-y-4",
            children: ({ nextStage, disabled }) => (
              <ResetPasswordForm nextStage={nextStage} disabled={disabled} />
            ),
          },
          {
            prevStageHeight: 176,
            children: ({ prevStage, disabled }) => (
              <ResetPasswordConfirmForm prevStage={prevStage} disabled={disabled} />
            ),
          },
        ]}
        style={{ marginTop: "6px" }}
      />
    </>
  );
}
