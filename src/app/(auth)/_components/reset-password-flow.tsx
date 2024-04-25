"use client";

import { useState } from "react";
import ResetPasswordConfirmForm from "../_components/reset-password-confirm-form";
import ResetPasswordForm from "../_components/reset-password-form";
import StageManager from "~/components/stage-manager";

export default function ResetPasswordFlow() {
  const [stage, setStage] = useState(0);

  return (
    <StageManager
      stage={stage}
      stages={[
        {
          className: "space-y-4",
          children: <ResetPasswordForm setStage={setStage} />,
        },
        {
          prevStageHeight: 176,
          className: "space-y-4",
          children: <ResetPasswordConfirmForm setStage={setStage} />,
        },
      ]}
      style={{ marginTop: "0" }}
      className="pb-1"
    />
  );
}
