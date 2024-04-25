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
            children: ({ nextStage }) => <ResetPasswordForm nextStage={nextStage} />,
          },
          {
            prevStageHeight: 176,
            className: "space-y-4",
            children: ({ prevStage }) => <ResetPasswordConfirmForm prevStage={prevStage} />,
          },
          {
            prevStageHeight: 247,
            className: "space-y-4",
            children: ({ nextStage }) => <ResetPasswordForm nextStage={nextStage} />,
          },
        ]}
        debug
        style={{ marginTop: "0" }}
        className="pb-4"
      />
    </>
  );
}
